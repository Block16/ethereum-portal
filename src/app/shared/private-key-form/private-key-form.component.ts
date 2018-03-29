import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-private-key-form',
  templateUrl: './private-key-form.component.html',
  styleUrls: ['./private-key-form.component.scss']
})
export class PrivateKeyFormComponent implements OnInit {
  @Output() privateKey = new EventEmitter<string>();
  public privateKeyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.privateKeyForm = this.formBuilder.group({
      privateKey : ['', [
          Validators.required,
          Validators.pattern('^(0x){0,1}[a-fA-F0-9]{64}$')
        ]
      ]
    });
  }

  public onSubmit() {
    if (this.privateKeyForm.valid) {
      const privKey = this.privateKeyForm.value.privateKey.startsWith('0x') ?
        this.privateKeyForm.value.substring(2) : this.privateKeyForm.value;
      this.privateKey.next(privKey);
    }
  }
}
