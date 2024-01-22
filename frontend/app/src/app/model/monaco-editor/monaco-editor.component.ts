import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrl: './monaco-editor.component.css'
})
export class MonacoEditorComponent {
  editorOptions = {theme: 'vs', language: 'python'};
  code: string= 'def x():\n\tprint("Hello world!")';
}
