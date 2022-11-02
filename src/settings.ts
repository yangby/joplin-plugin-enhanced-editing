import joplin from 'api';
import { SettingItem, SettingItemType, SettingItemSubType } from 'api/types';

import { Config } from './config';
import { Logger } from './logger';

export namespace Settings {
    export const register = _register;
    export const fetch = _fetch;
}

async function _register() {
    const logger = new Logger();

    logger.info(`Settings register section "${Config.sectionName}".`);
    await joplin.settings.registerSection(Config.sectionName, {
        label: Config.sectionName,
        iconName: 'fas fa-cog',
        description: 'An enhanced editing plugin for Joplin.',
    });

    let settings: Record<string, SettingItem> = {};

    // For Editor Option
    settings['indentUnit'] = {
        public: true,
        type: SettingItemType.Int,
        label: 'Indent Unit',
        description: 'How many spaces a block (whatever that means in the \
            edited language) should be indented. (default: 2)',
        value: 2,
        section: Config.sectionName,
    };
    settings['smartIndent'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Smart Indent',
        description: 'Whether to use the context-sensitive indentation \
            that the mode provides (or just indent the same as the line \
            before). (default: true)',
        value: true,
        section: Config.sectionName,
    };
    settings['tabSize'] = {
        public: true,
        type: SettingItemType.Int,
        label: 'Tab Size',
        description: 'The width of a tab character. (default: 4)',
        value: 4,
        section: Config.sectionName,
    };
    settings['indentWithTabs'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Indent With Tabs',
        description: 'Whether, when indenting, the first N*tabSize spaces \
            should be replaced by N tabs. (default: false)',
        value: false,
        section: Config.sectionName,
    };
    settings['lineWrapping'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Enable Line Wrapping',
        description: 'Whether the editor should scroll or wrap for long \
            lines. (default: false)',
        value: false,
        section: Config.sectionName,
    };
    settings['lineNumbers'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Show Line Numbers',
        description: 'Whether to show line numbers to the left of the \
            editor. (default: false)',
        value: false,
        section: Config.sectionName,
    };
    settings['fixedGutter'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Fixed Gutter',
        description: 'Determines whether the gutter scrolls along with the \
            content horizontally (false) or whether it stays fixed during \
            horizontal scrolling (true, the default).',
        value: true,
        section: Config.sectionName,
    };
    // scrollbarStyle:
    //      Chooses a scrollbar implementation.
    //      - The default is "native", showing native scrollbars.
    //      - The core library also provides the "null" style,
    //        which completely hides the scrollbars.',
    settings['hideScrollbar'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Hide Scrollbar',
        description: 'Hides the scrollbars. (default: false)',
        value: false,
        section: Config.sectionName,
    };
    settings['coverGutterNextToScrollbar'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Cover Gutter Next To Scrollbar',
        description: 'When fixedGutter is on, and there is a horizontal \
            scrollbar, by default the gutter will be visible to the left \
            of this scrollbar. If this option is set to true, it will be \
            covered by an element.',
        value: false,
        section: Config.sectionName,
    };
    // readOnly:
    //      If the special value "nocursor" is given (instead of simply
    //      true), focusing of the editor is also disallowed.
    settings['readOnly'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Read Only',
        description: 'Disables editing of the editor content by the user. \
            (default: false)',
        value: false,
        section: Config.sectionName,
    };
    settings['autocorrect'] = {
        public: false,
        type: SettingItemType.Bool,
        label: 'Auto Correct',
        description: 'Specifies whether or not autocorrect will be enabled \
            on the input. (default: false)',
        value: false,
        section: Config.sectionName,
    };
    settings['autocapitalize'] = {
        public: false,
        type: SettingItemType.Bool,
        label: 'Auto Capitalize',
        description: 'Specifies whether or not autocapitalization will be \
            enabled on the input. (default: false)',
        value: false,
        section: Config.sectionName,
    };

    //
    settings['formatBeforeSynchronize'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Format Before Synchronize',
        description: 'Format automatically before synchronize.',
        value: false,
        section: Config.sectionName,
    };

    // For Editor Extension
    settings['replaceTabWithSpaces'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Replace Tab With Spaces',
        description: 'Replace all tab characters with spaces. Each one tab \
            character, replace with tabSize spaces.',
        value: false,
        section: Config.sectionName,
    };
    settings['trimTrailingSpaces'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Trim Trailing Spaces',
        description: 'Remove trailing spaces at the end of the line.',
        value: false,
        section: Config.sectionName,
    };
    settings['mergeMultipleBlankLines'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Merge Multiple Blank Lines',
        description: 'Merge multiple blank lines into a single.',
        value: false,
        section: Config.sectionName,
    };
    settings['ensureNewlineAtEOF'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'Ensure Newline at EOF',
        description: 'Ensure the last line of the file ends in a newline.',
        value: false,
        section: Config.sectionName,
    };

    logger.info('Settings register all settings.');
    await joplin.settings.registerSettings(settings);
}

async function _fetch() {
    const logger = new Logger();
    logger.debug('Settings are being fetched.');
    let settings = {};
    const settingNames = [
        'indentUnit',
        'smartIndent',
        'tabSize',
        'indentWithTabs',
        'lineWrapping',
        'lineNumbers',
        'fixedGutter',
        'hideScrollbar',
        'coverGutterNextToScrollbar',
        'readOnly',
        'autocorrect',
        'autocapitalize',
        'replaceTabWithSpaces',
        'trimTrailingSpaces',
        'mergeMultipleBlankLines',
        'ensureNewlineAtEOF',
    ];
    for (const name of settingNames) {
        settings[name] = await joplin.settings.value(name);
    }
    return settings;
}
