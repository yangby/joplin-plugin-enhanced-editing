import joplin from 'api';
import {
    ContentScriptType, MenuItemLocation, ToolbarButtonLocation
} from 'api/types';

import { Config } from './config';
import { Logger } from './logger';
import { Settings } from './settings';

joplin.plugins.register({ onStart: onStartFunc });

async function onStartFunc() {
    const logger = new Logger();

    logger.info('Started.');

    await Settings.register();

    await joplin.contentScripts.register(
        ContentScriptType.CodeMirrorPlugin,
        Config.contentScriptId,
        './enhanced_editing.js'
    );

    await joplin.contentScripts.onMessage(
        Config.contentScriptId,
        async (message) => {
            const id = Config.contentScriptId;
            logger.info(`Content script "${id}" get message "${message.name}".`);
            if (message.name === Config.messageName) {
                return await Settings.fetch();
            }
            logger.warn(`Unknown message "${message.name}" for the content script "${id}".`);
        }
    );

    await joplin.commands.register({
        name: Config.formatCommand,
        label: `${Config.sectionName} / Format`,
        iconName: 'fas fa-brush',
        enabledCondition: 'markdownEditorVisible',
        execute: async () => {
            logger.debug('Call format command.');
            await execCommand(Config.formatCommand);
        }
    });
    await joplin.commands.register({
        name: 'switchEnhancedEditingReadOnly',
        label: `${Config.sectionName} / Read Only`,
        iconName: 'fas fa-ban',
        enabledCondition: 'markdownEditorVisible',
        execute: async () => {
            const readOnly = await joplin.settings.value('readOnly');
            logger.debug(`Call readonly command with "${readOnly}".`);
            await joplin.settings.setValue('readOnly', !readOnly);
            await execCommand(Config.refreshCommand);
        }
    });

    await joplin.views.menuItems.create(
        'formatFromEdit',
        Config.formatCommand,
        MenuItemLocation.Edit
    );
    await joplin.views.menuItems.create(
        'formatFromContextMenu',
        Config.formatCommand,
        MenuItemLocation.EditorContextMenu
    );
    await joplin.views.toolbarButtons.create(
        'formatFromToolbar',
        Config.formatCommand,
        ToolbarButtonLocation.EditorToolbar
    );
    await joplin.views.toolbarButtons.create(
        'readonlyFromToolbar',
        'switchEnhancedEditingReadOnly',
        ToolbarButtonLocation.EditorToolbar
    );

    // TODO How to do format on save event?
    await joplin.workspace.onSyncStart(async (_handler) => {
        if (await joplin.settings.value('formatBeforeSynchronize')) {
            await execCommand(Config.formatCommand);
        }
    });

    await execCommand(Config.refreshCommand);
}

async function execCommand(cmdName) {
    await joplin.commands.execute('editor.execCommand', { name: cmdName });
}
