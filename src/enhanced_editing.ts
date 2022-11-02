import { Config } from './config';
import { Logger } from './logger';

export default function(context) {
    let codeMirrorOptions = {};
    codeMirrorOptions[Config.optionName] = true;
    return {
        plugin: plugin(context),
        codeMirrorOptions: codeMirrorOptions,
    };
}

function plugin(context) {
    return function(CodeMirror) {
        define_option(CodeMirror, context);
        define_format_extension(CodeMirror, context);
        define_refresh_extension(CodeMirror, context);
    };
}

function define_option(CodeMirror, context) {
    CodeMirror.defineOption(
        Config.optionName,
        false,
        async function(cm, val, old) {
            const logger = new Logger();
            logger.trace('Refresh since the options were changed.');
            await refresh(cm, context, logger);
        }
    );
}

function define_format_extension(CodeMirror, context) {
    CodeMirror.defineExtension(Config.formatCommand, async function () {
        const logger = new Logger();
        logger.trace('Format since the command was called.');
        const options = await context.postMessage({ name: Config.messageName });
        logger.trace(`Options are ${JSON.stringify(options)}.`);
        const tabSize = options['tabSize'];
        const replaceTabWithSpaces = options['replaceTabWithSpaces'];
        const trimTrailingSpaces = options['trimTrailingSpaces'];
        const mergeMultipleBlankLines = options['mergeMultipleBlankLines'];
        const ensureNewlineAtEOF = options['ensureNewlineAtEOF'];

        const cm = this;
        const cursor = cm.getCursor();
        const doc = cm.getDoc();
        const content = doc.getValue();

        if (!content) {
            return;
        }

        const lines = content.split('\n');
        const lineCount = lines.length;
        const endLine = lines[lineCount - 1];

        const newLines = [];
        let prevIsEmpty = false;
        for (const line of lines) {
            let newLine = line;
            if (trimTrailingSpaces) {
                newLine = newLine.trimEnd();
            }
            if (replaceTabWithSpaces) {
                newLine = newLine.replaceAll('\t', ' '.repeat(tabSize));
            }
            if (prevIsEmpty) {
                if (mergeMultipleBlankLines && newLine) {
                    newLines.push(newLine);
                }
            } else {
                newLines.push(newLine);
            }
            prevIsEmpty = newLine.length === 0;
        }
        if (ensureNewlineAtEOF) {
            newLines.push('');
        }

        let lineIndex = newLines.length - 1;
        while (!newLines[lineIndex]) {
            lineIndex -= 1;
        }
        lineIndex += 1;

        const newBody = newLines.slice(0, lineIndex+1).join('\n');

        cm.replaceRange(
            newBody,
            { line: 0, ch: 0 },
            { line: lineCount, ch: endLine.length },
            content);
        cm.setCursor(cursor);
    });
}

function define_refresh_extension(CodeMirror, context) {
    CodeMirror.defineExtension(Config.refreshCommand, async function () {
        const logger = new Logger();
        logger.trace('Refresh since the command was called.');
        await refresh(this, context, logger);
    });
}

async function refresh(cm, context, logger) {
    const options = await context.postMessage({ name: Config.messageName });
    logger.trace(`Options are ${JSON.stringify(options)}.`);
    const optionNames = [
        'indentUnit',
        'smartIndent',
        'tabSize',
        'indentWithTabs',
        'lineWrapping',
        'lineNumbers',
        'fixedGutter',
        // 'scrollbarStyle',
        'coverGutterNextToScrollbar',
        // 'readOnly',
        'autocorrect',
        'autocapitalize',
    ];
    for (const name of optionNames) {
        cm.setOption(name, options[name]);
    }
    if (options['hideScrollbar']) {
        cm.setOption('scrollbarStyle', 'null');
    } else {
        cm.setOption('scrollbarStyle', 'native');
    }
    if (options['readOnly']) {
        cm.setOption('readOnly', 'nocursor');
    } else {
        cm.setOption('readOnly', false);
    }
    cm.refresh();
}
