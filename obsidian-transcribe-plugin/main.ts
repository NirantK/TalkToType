import {
	App,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile
} from "obsidian";

import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

interface TalkToTypePluginSettings {
	openAIKey: string;
}

const DEFAULT_SETTINGS: TalkToTypePluginSettings = {
	openAIKey: "default",
};

export default class TalkToType extends Plugin {
	settings: TalkToTypePluginSettings;

	async onload() {
		await this.loadSettings();
		console.log("Loading TalkToType");

		this.addCommand({
			id: "transcribe-current-recording",
			name: "Transcribe Current Recording",
			callback: this.processCurrentRecording.bind(this),
		});

		this.addCommand({
			id: "transcribe-all-recordings",
			name: "Transcribe All Recordings",
			callback: this.processAllRecordings.bind(this),
		});

		this.addCommand({
			id: "transcribe-and-summarize-current-recording",
			name: "Transcribe and Summarize Current Recording",
			callback: this.processAndSummarizeCurrentRecording.bind(this),
		});

		// This adds a settings tab so the user can configure various aspects of
		// TalkToType plugin as Open AI Key for Transcribing.
		this.addSettingTab(new TalkToTypeSettingTab(this.app, this));
	}

	async onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async summarize(transcribed_text: string) {
		console.log("Summarizing the text:", transcribed_text);
		const template = `Assistant is a large language model trained by OpenAI.

		Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

		Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

		Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

		Assistant is aware that human input is being transcribed from audio and as such there may be some errors in the transcription. It will attempt to account for some words being swapped with similar-sounding words or phrases. Assistant will also keep responses concise, because human attention spans are more limited over the audio channel since it takes time to listen to a response.

		Please assess and arrange them as bullet points.

		Human: {human_input}

		Assistant:`;

		const prompt = new PromptTemplate({ template, inputVariables: ["human_input"] });

		const model = new OpenAI({ openAIApiKey: this.settings.openAIKey, temperature: 0 });
		const chain = new LLMChain({ llm: model, prompt });
		const summary_text = await chain.call({ human_input: transcribed_text });
		this.createNote(summary_text.text);
	}


	async transcribeAudio(fileBinary: ArrayBuffer, summarize: boolean = false) {

		console.log("Transcribing audio...");
		const endpoint = "https://api.openai.com/v1/audio/transcriptions";
		const apiKey = this.settings.openAIKey;

		if (apiKey === "default") {
			new Notice("Open AI Key not set. Please set it in the settings.");
			return;
		} else {
			const formData = new FormData();
			formData.append("file", new Blob([fileBinary]), "audio.webm");
			formData.append("model", "whisper-1");

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
				body: formData,
			});

			if (response.ok) {
				const result = await response.json();
				console.log("Transcription complete:", result);
				if (result.text) {
					if (summarize) {
						this.summarize(result.text);
					} else {
						this.createNote(result.text);
					}
				}
			} else {
				console.error(
					"Transcription failed:",
					response.status,
					response.statusText
				);
			}
		}
	}

	async processCurrentRecording() {
		// Get the current audio file in view
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			try {
				console.log("Processing file:", activeFile.name);
				const fileBinary = await this.app.vault.readBinary(activeFile);
				this.transcribeAudio(fileBinary, false);
			} catch (error) {
				console.error(`Error processing file: ${activeFile.name}`, error);
			}
		}
	}

	async processAndSummarizeCurrentRecording() {
		// Get the current audio file in view
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			try {
				console.log("Processing file:", activeFile.name);
				const fileBinary = await this.app.vault.readBinary(activeFile);
				this.transcribeAudio(fileBinary, true);
			} catch (error) {
				console.error(`Error processing file: ${activeFile.name}`, error);
			}
		}
	}

	async processAllRecordings() {
		// Get all the files in the vault
		const files = this.app.vault.getFiles();

		// Iterate through each file and process the WebM recordings
		for (const file of files) {
			const extension = file.path.split(".").pop();

			// Check if the file extension is WebM
			if (extension === "webm") {
				console.log("found webm file");

				try {
					const fileBinary = await this.app.vault.readBinary(file);
					this.transcribeAudio(fileBinary);
				} catch (error) {
					console.error(`Error processing file: ${file.name}`, error);
				}
			}
		}
	}

	async createNote(content_body: string) {
		// Create a new Date object
		const currentDate = new Date();

		// Get the timestamp in milliseconds
		const timestamp = currentDate.getTime();

		// Log the current date, time, and timestamp
		console.log('Current date and time:', currentDate);
		console.log('Timestamp:', timestamp);

		const title = `Transcribed Note ${timestamp}`; // Specify the title for the note

		const content = content_body; // Specify the content for the note

		try {
			console.log("Creating Note");
			const newFile = await this.app.vault.create(`${title}.md`, content);
			if (newFile instanceof TFile) {
				new Notice(`Note "${newFile.basename}" created successfully.`);
			} else {
				new Notice("Failed to create the note.");
			}
			console.log("note created");
		} catch (error) {
			new Notice("An error occurred while creating the note.");
			console.error(error);
		}
	}
}

class TalkToTypeSettingTab extends PluginSettingTab {
	plugin: TalkToType;

	constructor(app: App, plugin: TalkToType) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings for TalkToType" });

		new Setting(containerEl)
			.setName("1. Open AI Key")
			.setDesc(
				"You'll find the key at https://platform.openai.com/account/api-keys"
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.openAIKey)
					.onChange(async (value) => {
						this.plugin.settings.openAIKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
