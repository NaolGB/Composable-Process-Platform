import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ProcessTypeParsedData } from '../../interfaces';

/**
 * Monaco Editor integration: https://www.npmjs.com/package/ngx-monaco-editor-v2
 */

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrl: './monaco-editor.component.css'
})
export class MonacoEditorComponent {
  @Input() contentType!: string
  @Input() allStepsObject!: ProcessTypeParsedData  
  @Input() selectedStepKey!: string | number 
  @Output() editorContentChange = new EventEmitter<string>()

  // editorContent: string = 'this.requirementCode'
  editorOptions = {theme: 'vs', language: 'python'};
  initialRequirementCode: string = '# insert code here'
  requirementCode: string = this.initialRequirementCode

  constructor(private cd: ChangeDetectorRef) {}
  
  ngOnInt() {}

  ngAfterViewInit() {
    if(this.contentType === 'requirements') {
      this.requirementCode = this.allStepsObject[this.selectedStepKey]['next_steps']['requirements']
    }
    else if(this.contentType === 'actions') {
      this.requirementCode = this.allStepsObject[this.selectedStepKey]['options']['save']['actions']
    }
    this.cd.detectChanges()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change')
    if (changes['selectedStepKey']) {
      if(this.contentType === 'requirements') {
        this.requirementCode = this.allStepsObject[this.selectedStepKey]['next_steps']['requirements']
      }
      else if(this.contentType === 'actions') {
        this.requirementCode = this.allStepsObject[this.selectedStepKey]['options']['save']['actions']
      }
    }
  }

  ngDoCheck() {
    if(this.requirementCode !== this.initialRequirementCode) {
      this.editorContentChange.emit(this.requirementCode)
    }
  }
}
