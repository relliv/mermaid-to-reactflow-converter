import { ChangeEvent, FC, useState } from "react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
import { loadWASM } from "onigasm";
import { IGrammarDefinition, Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { IVSCodeTheme, convertTheme } from "@estruyf/vscode-theme-converter";
import { IVsCodeThemeOption } from "../../shared/models/vs-code-theme.model";

export interface IMonacoEditorViewProps {
  code: string;
  onCodeChange: (code: string) => void;
  onInit: (editor: editor.IStandaloneCodeEditor) => void;
}

/**
 * Custom monaco editor view
 *
 * @source https://github.com/relliv/monaco-editor-textmate-theme-loading-example
 */
const MonacoEditorView: FC<IMonacoEditorViewProps> = ({
  code,
  onCodeChange,
  onInit,
}) => {
  const [vsCodeThemes] = useState<IVsCodeThemeOption[]>([
    {
      displayName: "Material Theme Ocean",
      name: "material-theme-ocean",
    },
    {
      displayName: "Poimandres",
      name: "poimandres",
    },
    {
      displayName: "Monokai",
      name: "monokai",
    },
    {
      displayName: "One Light",
      name: "one-light",
    },
    {
      displayName: "2077 theme (endormi)",
      name: "endormi-2077",
    },
  ]);

  /**
   * On theme select change event
   */
  function onThemeChange(event: ChangeEvent<HTMLSelectElement>) {
    const themeName = event.target.value,
      selectedTheme = vsCodeThemes.find((theme) => theme.name === themeName)!;

    loadTheme(selectedTheme);
  }

  /**
   * Load selected theme into monoaco editor
   */
  async function loadTheme(theme: IVsCodeThemeOption) {
    await fetch(`/assets/vsc-themes/${theme.name}.json`).then(
      async (response: Response) => {
        if (response.status === 200) {
          const myExportedTheme = await response.json(),
            convertedTheme: editor.IStandaloneThemeData = convertTheme(
              myExportedTheme as IVSCodeTheme
            );

          monaco.editor.defineTheme(theme.name, convertedTheme);
          monaco.editor.setTheme(theme.name);

          // clear warning message
          document.querySelector("mark")?.remove();
        }
      }
    );
  }

  /**
   * Load onigasm wasm file
   * Required for monaco editor to work with textmate grammars
   */
  async function loadWasm(): Promise<void> {
    const onigasmResponse = await fetch(
      "https://cdn.jsdelivr.net/npm/onigasm@latest/lib/onigasm.wasm" // use for web (to prevent CORS etc.)
      // 'onigasm/lib/onigasm.wasm' // use while working on local or custom loaders (webpack, vite, etc.)
    );

    if (
      onigasmResponse.status !== 200 ||
      onigasmResponse.headers.get("content-type") !== "application/wasm"
    ) {
      return;
    }

    const wasmContent = await onigasmResponse.arrayBuffer();

    if (wasmContent) {
      await loadWASM(wasmContent);
    }
  }

  /**
   * Register grammars, languages then wire them with monaco editor
   */
  async function initMonacoEditor(): Promise<void> {
    const editorElement = document.getElementById("editor");

    // #region Register Grammars

    const registry = new Registry({
      getGrammarDefinition: async (): Promise<IGrammarDefinition> => {
        const res: IGrammarDefinition = {
          format: "json",
          content: await (
            await fetch("/assets/textmate/grammars/mermaid.json")
          ).text(),
        };

        return res;
      },
    });

    const grammars = new Map();

    monaco.languages.register({ id: "mermaid" });

    grammars.set("mermaid", "source.mermaid");

    // #endregion

    // #region Init Editor

    const editorInstance: editor.IStandaloneCodeEditor = monaco.editor.create(
      editorElement!,
      {
        value: code,
        language: "mermaid",
        theme: "vs",
        inDiffEditor: false,
        minimap: {
          enabled: false,
        },
      }
    );

    const installedEditors =
      editorElement?.getElementsByClassName("monaco-editor");

    // remove duplicate editors
    if (installedEditors && installedEditors.length > 1) {
      for (let i = 1; i < installedEditors.length; i++) {
        if (i === 0) {
          continue;
        }

        editorElement?.removeChild(installedEditors[i]);
      }
    }

    // #endregion

    // #region Wire Grammars

    await wireTmGrammars(monaco, registry, grammars, editorInstance);

    // #endregion

    // set on code change event
    editorInstance.onDidChangeModelContent(() =>
      onCodeChange(editorInstance.getValue())
    );

    // set initial theme
    loadTheme(
      vsCodeThemes.find(
        (theme: IVsCodeThemeOption) => theme.name === "one-light"
      )!
    );

    editorInstance?.layout();

    onInit(editorInstance);
  }

  /**
   * Load onigasm wasm and init monaco editor
   */
  (async () => {
    setTimeout(async () => {
      await loadWasm();
      await initMonacoEditor();
    }, 500);
  })();

  return (
    <>
      <select
        id="theme-select"
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onThemeChange(event)
        }
      >
        {vsCodeThemes.map((vsCodeTheme: IVsCodeThemeOption) => (
          <option key={vsCodeTheme.name} value={vsCodeTheme.name}>
            {vsCodeTheme.displayName}
          </option>
        ))}
      </select>

      <div id="editor"></div>
    </>
  );
};

export default MonacoEditorView;
