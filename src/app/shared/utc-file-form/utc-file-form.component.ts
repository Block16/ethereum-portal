import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from "util";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
declare const keythereum;

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}

@Component({
  selector: 'app-utc-file-form',
  templateUrl: './utc-file-form.component.html',
  styleUrls: ['./utc-file-form.component.scss']
})
export class UtcFileFormComponent implements OnInit {
  public fileUploadText: string;
  public utcObject: any;
  public utcFile: File;
  public showUtcModal: boolean;
  public passwordForm: FormGroup;
  @Output() privateKey = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password : ['',  []]
    });
    this.clear();
  }

  private clear() {
    this.fileUploadText = 'Upload UTC file';
    this.showUtcModal = false;
  }

  public utcInputChange(event) {
    this.utcFile = event.target.files[0];
    this.fileUploadText = (<HTMLInputElement>event.target).files[0].name;
    const reader = new FileReader();
    reader.addEventListener('loadend', (fre: FileReaderEvent) => {
      try {
        this.utcObject = JSON.parse(fre.target.result);
        if (typeof(this.utcObject.address) === 'undefined' || typeof(this.utcObject.Crypto) === 'undefined') {
          // TODO: display some information about how this is not a UTC object here
          return;
        }
        this.showUtcModal = true;
      } catch (e) {
        // TODO: some sort of information about how the UTC file was not a JSON file
        // Clear all the fields
      }
    });
    reader.readAsText(this.utcFile);
  }

  public passwordSubmit() {
    if (isNullOrUndefined(this.utcObject)) {
      console.log("This state should never happen - utcObject was not defined but a password was entered.");
      // TODO: Add an error for this
    }
    try {
      const privKeyBinary = keythereum.recover(this.passwordForm.value.password, this.utcObject);
      if (isNullOrUndefined(privKeyBinary)) {
        console.log("Was null or undefined");
        // TODO: Add error that the password was incorrect
      }
      let privKey = privKeyBinary.toString('hex');
      privKey = privKey.startsWith('0x') ? privKey.substring(2) : privKey;
      // Finally update the parent with the private key change
      this.privateKey.next(privKey);
    } catch (err) {
      // TODO: Failed to decrypt message
      console.log(err);
    }
  }
}
