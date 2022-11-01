import joplin from 'api';

joplin.plugins.register({
    onStart: async function() {
        console.info('[EnhancedEditing] Started.');
    },
});
