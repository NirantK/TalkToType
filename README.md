# TalkToType Plugin for Obsidian

The TalkToType plugin for Obsidian enables you to transcribe audio recordings into text and add them as notes in your Obsidian vault. Additionally, you can summarize your recordings and add it as a note.

## Features

- Transcribe all recordings: Transcribes all the audio recordings in your Obsidian vault to text and adds them as respective notes.
- Transcribe current recording: Transcribes the current audio recording and adds it as a note.
- Transcribe and summarize current recording: Transcribes the current audio recording, summarizes the content, and adds it as a note.

## Prerequisites

- [Obsidian](https://obsidian.md/) installed on your machine.

## Installation

1. Download the latest release of the TalkToType plugin from the [Releases](https://github.com/NirantK/TalkToType/releases) section.
2. Extract the downloaded ZIP file.
3. Copy the extracted folder into your Obsidian vault's plugins folder. The plugins folder is typically located at `<your-obsidian-vault>/.obsidian/plugins`.
4. Launch Obsidian.
5. Enable Audio Recorder plugin from the "Core Plugins" Tab in the Obsidian preferences/settings.
   ```Settings>Core Plugins>Audio recorder>Enable```
    This plugin is required for the TalkToType plugin to work.
6. Open the settings and navigate to the "Community Plugins" tab.
7. Enable the "TalkToType" plugin.
8. Add your [OpenAI API key](https://platform.openai.com/account/api-keys) to the plugin settings.

## Usage

![summarize](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWx3Y3EyaDU5b3M4eHp3eHdiZjV0enhlcWNpbHYxY29uNXgyNzkweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ka7yUKeHFPRoguVxno/giphy.gif)

### To transcribe all recordings:

1. Open the command palette by pressing `Ctrl/Cmd + P` or by clicking the `>_` icon on the sidebar menu.
2. Type "Transcribe All Recordings" and select the corresponding command from the list.
3. The plugin will process all the audio recordings in your vault and add the transcribed text as respective notes.

### To transcribe the current recording:

1. Open the recording your wish to transcribe.
2. Open the command palette by pressing `Ctrl/Cmd + P` or by clicking the `>_` icon on the sidebar menu.
3. Type "Transcribe Current Recording" and select the corresponding command from the list.
4. The plugin will process the opened audio recording and add the transcribed text as respective notes.

### To transcribe and summarize the current recording:

1. Open the recording your wish to transcribe.
2. Open the command palette by pressing `Ctrl/Cmd + P` or by clicking the `>_` icon on the sidebar menu.
3. Type "Transcribe and Summarize Current Recording" and select the corresponding command from the list.
4. The plugin will transcribe the current audio recording, summarize the content, and add it as a new note in your vault.

Note: Ensure that the TalkToType plugin is installed and enabled before using these commands. You can refer to the [Installation](#installation) section for instructions on how to install and enable the plugin.

## Configuration

To configure the TalkToType plugin, follow these steps:

1. Open Obsidian.
2. Go to the plugin settings.
3. Find the "TalkToType" plugin settings.
4. Adjust the settings according to your preferences.

## Feedback and Support

If you encounter any issues or have suggestions for improving the TalkToType plugin, please feel free to submit an issue on the [GitHub repository](https://github.com/NirantK/TalkToType/issues).

## Contributing

Contributions to the TalkToType plugin are welcome! If you'd like to contribute, please follow the guidelines outlined in the [Contribution Guide](CONTRIBUTING.md).

## License

This plugin is licensed under the [MIT License](LICENSE).
