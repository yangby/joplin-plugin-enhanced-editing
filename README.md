# Enhanced Editing Plugin for Joplin

[![License]](#license)

An enhanced editing plugin for [Joplin].

[License]: https://img.shields.io/github/license/yangby/joplin-plugin-enhanced-editing.svg

## Features

- Expose some CodeMirror options.

  Such as:
  - Wrap for long lines or not.
  - Show line numbers.
  - Enable read-only mode.

- Simple formatting.
  - Format automatically before synchronize.
  - Replace all tab characters with spaces.
  - Remove trailing spaces at the end of the line.
  - Merge multiple blank lines into a single.
  - Ensure the last line of the file ends in a newline.

## References

- [Joplin: Getting started with plugin development](https://joplinapp.org/api/get_started/plugins/)
- [CodeMirror: Configuration](https://codemirror.net/5/doc/manual.html#config)

## License

Licensed under [GNU AGPLv3].

[Joplin]: https://joplinapp.org/
[GNU AGPLv3]: https://www.gnu.org/licenses/agpl-3.0.html "GNU Affero General Public License Version 3"
