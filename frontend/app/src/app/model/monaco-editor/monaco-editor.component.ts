import { Component, ElementRef, Input, ViewChild } from '@angular/core';

/**
 * Monaco Editor integration: https://www.npmjs.com/package/ngx-monaco-editor-v2
 */

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrl: './monaco-editor.component.css'
})
export class MonacoEditorComponent {
  @Input() requirementCode: string | undefined

  code: string= '# insert code here'
  editorOptions = {theme: 'vs', language: 'python'};
  
  ngOnInt() {
    if (this.requirementCode) {
      this.code = this.requirementCode
    }
  }
}
