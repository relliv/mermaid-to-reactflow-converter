/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
import { loadWASM } from "onigasm";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { IVSCodeTheme, convertTheme } from "@estruyf/vscode-theme-converter";

const MermaidView: FC<any> = () => {
  const [vsCodeThemes, setVsCodeThemes] = useState<any[]>([
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

  useEffect(() => {}, []);

  const monacoEditorElementRef: any = useRef<HTMLDivElement>();

  function onThemeChange(event: any) {
    const themeName = event.target.value;

    loadTheme(vsCodeThemes.find((theme) => theme.name === themeName));
  }

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

  return (
    <>
      <select id="theme-select" onChange={(event) => onThemeChange(event)}>
        {vsCodeThemes.map((vsCodeTheme: any) => (
          <option key={vsCodeTheme.name} value={vsCodeTheme.name}>
            {vsCodeTheme.displayName}
          </option>
        ))}
      </select>

      <div id="editor" ref={monacoEditorElementRef}>
        <mark> It takes some time to load, please wait. </mark>
      </div>
    </>
  );
};

export default MermaidView;
