/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
import { loadWASM } from "onigasm";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { IVSCodeTheme, convertTheme } from "@estruyf/vscode-theme-converter";

export interface IMonacoEditorViewProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const MonacoEditorView: FC<IMonacoEditorViewProps> = ({
  code,
  onCodeChange,
}) => {
  const [vsCodeThemes] = useState<any[]>([
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
  ]);

  /**
   * On theme select change event
   */
  function onThemeChange(event: any) {
    const themeName = event.target.value,
      selectedTheme = vsCodeThemes.find((theme) => theme.name === themeName);

    loadTheme(selectedTheme);
  }

  /**
   * Load selected theme into monoaco editor
   */
  async function loadTheme(theme: any) {
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

  async function loadWasm(): Promise<void> {
    const onigasmResponse = await fetch(
      "https://cdn.jsdelivr.net/npm/onigasm@latest/lib/onigasm.wasm" // use for web (to prevent CORS etc.)
      // 'onigasm/lib/onigasm.wasm' // use while working on local or custom loaders (webpack, vite, etc.)
    );

    if (
      onigasmResponse.status !== 200 ||
      onigasmResponse.headers.get("content-type") !== "application/wasm"
    ) {
      return null;
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
      getGrammarDefinition: async (scopeName: string): Promise<any> => {
        console.log("scopeName", scopeName);

        const res: any = {
          format: "json",
          content: await (
            await fetch("/assets/textmate/grammars/mermaid.json")
          ).text(),
        };

        console.log("grammarContent", res);

        return res;
      },
    });

    const grammars = new Map();

    monaco.languages.register({ id: "mermaid" });

    grammars.set("mermaid", "source.mermaid");

    console.log(grammars);

    // #endregion

    // #region Init Editor

    const editor = monaco.editor.create(editorElement!, {
      value: code,
      language: "mermaid",
      theme: "vs-dark",
      inDiffEditor: false,
      minimap: {
        enabled: false,
      },
    });

    const installedEditors =
      editorElement?.getElementsByClassName("monaco-editor");

    if (installedEditors && installedEditors.length > 1) {
      // remove second editor instance
      editorElement?.removeChild(installedEditors[1]);
    }

    // #endregion

    // #region Wire Grammars

    await wireTmGrammars(monaco, registry, grammars, editor);

    // #endregion

    editor.onDidChangeModelContent(() => {
      onCodeChange(editor.getValue());
    });
  }

  (async () => {
    setTimeout(async () => {
      await loadWasm();
      await initMonacoEditor();
    }, 500);
  })();

  return (
    <>
      <select id="theme-select" onChange={(event) => onThemeChange(event)}>
        {vsCodeThemes.map((vsCodeTheme: any) => (
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
