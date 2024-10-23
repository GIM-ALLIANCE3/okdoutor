import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CadastroComponent implements OnInit {
  emailValidated = false;
  codeConfirmed = false;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private naja: NajaService,
    private loading: LoadingService,
    private messageService: MessageService
  ) {

  }
  public cadastroForm: FormGroup | any = this._fb.group({
    cpf: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(14), this.cpfValidator.bind(this)]],
    nome: [null, [Validators.required, Validators.minLength(3), this.nameValidator]],
    celular: ['', [Validators.required, Validators.minLength(10), this.phoneValidator.bind(this)]],
    email: ['', [Validators.required, this.emailValidator.bind(this)]],
    code: [null, [Validators.required, this.confirmCodeVal.bind(this)]],
    nomeDaMae: [null, [Validators.required, Validators.minLength(3), this.nameValidator]],
    password: [null, [Validators.minLength(8), Validators.required, this.passwordValidator]],
    passwordConfirm: [null, [Validators.minLength(8), Validators.required, this.confirmPasswordValidator]],
    term: [false, { updateOn: 'change' }, Validators.requiredTrue],
  });

  ngOnInit(): void {
    this.cadastroForm.disable();
    this.cadastroForm.get('cpf').enable();
    // this.setupFieldValidationWatchers();
  }

  resetAndDisableFieldsFrom(startIndex: number) {
    const formFields = Object.keys(this.cadastroForm.controls);
    for (let i = startIndex + 1; i < formFields.length; i++) {
      const control = this.cadastroForm.get(formFields[i]) as AbstractControl;
      control.reset();
      control.disable();
    }
  }

  confirmCode() {
    const body = {
      email: this.cadastroForm.get('email')?.value,
      code: (this.cadastroForm.get('code')?.value as string).toUpperCase()
    }
    this.naja.confirmCode(body).subscribe({
      next: (response) => {
        if (response.STATUS === "SUCCESS") {
          if (this.codeConfirmed === false) {
            // this.mensagemodal = "Código confirmado com sucesso!";
            // this.displayModal = true;
          }
          this.codeConfirmed = true;
        }
      },
      error: (error) => {
        console.log(error);
        this.codeConfirmed = false;
      }
    });
  }

  notify2(titulo: string = "Aviso!", mensagem: string = "Código enviado para o e-mail cadastrado.", redirect: string = '/cadastro') {
    this.messageService.clear();
    this.messageService.add({
      key: 'block2',
      severity: 'custom-2',
      summary: titulo,
      closable: false,
      detail: mensagem,
      contentStyleClass: 'p-0',
      redirect: redirect
    } as any);
  }

  confirmCodeVal(control: AbstractControl): { [key: string]: any } | null {
    if (control.parent && control.value !== null && control.value !== undefined && control.value !== '') {
      const code = control.parent.get('code')?.value as any;
      this.confirmCode();
      setTimeout(() => {
        if (this.codeConfirmed === false) {
          control.setErrors({ ...control.errors, confirmCode: true });
        } else {
          control.setErrors(null);
        }
      }, 1000);
    }
    if (control.valid) {
      return null;
    }
    else {
      return { ...control.errors, confirmCode: true };
    }
  }

  register() {
    this.loading.show();
    const valor = this.cadastroForm.value;
    valor.nome = valor.nome.toUpperCase();
    valor.nomeDaMae = valor.nomeDaMae.toUpperCase();
    this.authService.createUser(valor).subscribe({
      next: (result: any) => {
        console.log("🚀 ~ file: cadastro.component.ts:33 ~ CadastroComponent ~ this.authService.createUser ~ result:", result);
        this.loading.hide();
        if (result.user) {
          this.notify2("Sucesso!", "Cadastro realizado com sucesso!", "/login");
          this.router.navigate(['/login']);
        }
      },
      error: (error: any) => {
        this.loading.hide();
        this.notify2("Erro!", "Erro ao realizar cadastro!");
        console.log(error);
      }
    });
  }

  confirmPasswordValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.parent) {
      const password = control.parent.get('password') as any;
      const confirmPassword = control.parent.get('passwordConfirm') as any;
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ ...confirmPassword.errors, confirmPassword: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
    if (control.valid) {
      return null;
    }
    else {
      return { ...control.errors, confirmEmail: true };
    }
  }

  termosValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value !== false) {
      control.setErrors({ ...control.errors, termos: true });
    } else {
      control.setErrors(null);
    }
    if (control.valid) {
      return null;
    }
    else {
      return { ...control.errors, confirmEmail: true };
    }
  }

  emailValidator(control: AbstractControl) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (this.emailValidated) {
      control.setErrors(null);
      return null;
    }

    if (!emailRegex.test(control.value.toLowerCase())) {
      const errors = control.errors ? control.errors : {};
      delete errors['emailExist'];
      control.setErrors(errors);
      return { ...control.errors, invalidEmail: true };
    }
    else {
      const baseUrl = environment.baseUrl;
      const http = new XMLHttpRequest();
      const email = control.value !== null ? control.value.toLowerCase() : '';
      const url = `${baseUrl}/email/${email}`;

      http.open('GET', url, false);
      http.send();
      const response: boolean = JSON.parse(http.responseText);
      if (response) {
        return { ...control.errors, emailExist: true };
      }
      else {
        this.emailValidated = true;
        control.setErrors(null);
        return null;
      }
    }
  }

  confirmEmail(control: AbstractControl): { [key: string]: any } | null {
    if (control.parent && control.value !== null && control.value !== undefined && control.value !== '') {
      const email = control.parent.get('email')?.value as any;
      const confirmEmail = control.value as any;
      if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
        control.setErrors({ ...control.errors, confirmEmail: true });
      } else {
        control.setErrors(null);
      }
    }
    if (control.valid) {
      return null;
    }
    else {
      return { ...control.errors, confirmEmail: true };
    }
  }

  passwordValidator(control: AbstractControl) {
    const passWordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passWordRegex.test(control.value)) {
      control.setErrors({ ...control.errors, invalidPassword: true });
      return { ...control.errors, invalidEmail: true };
    }
    control.setErrors(null);
    return null;
  }

  phoneValidator(control: AbstractControl) {
    const phone = control.value?.replace(/\D/g, '');

    if (phone.length < 10 || phone.length > 11) {
      control.setErrors({ ...control.errors, invalidPhone: true });
      return { ...control.errors, invalidPhone: true };
    }

    if (phone[2] !== '9') {
      control.setErrors({ ...control.errors, thirdDigitNotNine: true });
      return { ...control.errors, thirdDigitNotNine: true };
    }

    control.setErrors(null);
    return null;
  }

  nameValidator(control: AbstractControl) {
    const name = control.value ? control.value : '';
    if (name && (name.split(' ')[1] === undefined || name.split(' ')[1] === '')) {
      return { ...control.errors, name: true };
    }
    if (name && name.split(' ').length < 2) {
      return { ...control.errors, name: true };
    }
    control.setErrors(null);
    return null;
  }

  cpfValidator(control: FormControl): any {
    const cpf = control.parent?.get('cpf')?.value;
    if (control.value !== null) {
      if (!control.parent) {
        return null;
      }

      const baseUrl = environment.baseUrl;
      const http = new XMLHttpRequest();
      const formattedCpf = control.value !== null ? control.value.replace(/\D/g, '') : '';
      const url = `${baseUrl}/cpf/${formattedCpf}`;

      http.open('GET', url, false);
      http.send();
      const response: boolean = JSON.parse(http.responseText);

      if (this.TestaCPF(control.value) && !response) {
        return null;
      }
      else if (!this.TestaCPF(control.value)) {
        return { ...control.errors, cpfInvalid: true };
      }
      else {
        return { ...control.errors, cpfFound: true };
      }
    }
  }

  TestaCPF(strCPF: any): any {
    if (!strCPF) {
      return false;
    }
    strCPF = strCPF.replace(/\D/g, '');

    let Soma;
    let Resto;
    Soma = 0;
    if (strCPF === '00000000000' ||
      strCPF === '11111111111' ||
      strCPF === '22222222222' ||
      strCPF === '33333333333' ||
      strCPF === '44444444444' ||
      strCPF === '55555555555' ||
      strCPF === '66666666666' ||
      strCPF === '77777777777' ||
      strCPF === '88888888888' ||
      strCPF === '99999999999') {
      return false;
    }

    for (let i = 1; i <= 9; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) {
      Resto = 0;
    }
    if (Resto !== parseInt(strCPF.substring(9, 10), 10)) {
      return false;
    }

    Soma = 0;
    for (let i = 1; i <= 10; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) {
      Resto = 0;
    }
    if (Resto !== parseInt(strCPF.substring(10, 11), 10)) {
      return false;
    }
    return true;
  }

  sendCode() {
    this.loading.show();
    const body = {
      email: this.cadastroForm.get('email')?.value
    }
    this.naja.sendConfirmationCode(body).subscribe({
      next: (response) => {
        if (response.STATUS === "SUCCESS") {
          this.notify2();
        }
        this.loading.hide();
      },
      error: (error) => {
        console.log(error);
        this.loading.hide();
      }
    });
  }

  onFieldChange(formGroup: FormGroup) {
    const formFields = Object.keys(formGroup.controls);
    let previousFieldValid = true;
    let currentFieldValid = true;

    formFields.forEach(async (field, index) => {
      const control = formGroup.get(field) as AbstractControl;
      currentFieldValid = control.valid;


      if (field === 'cpf' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'Digite um CPF válido ou que não esteja cadastrado no sistema.' });
      }
      if (field === 'nome' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'O nome deve ser composto de nome e sobrenome.' });
      }
      if (field === 'celular' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'O número do telefone deve conter um prefixo mais o número com o total de 11 dígitos e ser iniciado com o dígito 9.' });
      }
      if (field === 'email' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'E-mail incorreto' });
      }
      if (field === 'code' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'Código inválido' });
      }
      if (field === 'nomeDaMae' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'O nome deve ser composto de nome e sobrenome.' });
      }
      if (field === 'password' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'A senha deve conter, no mínimo, 1 letra maiúscula, 1 número e 8 caracteres.' });
      }
      if (field === 'passwordConfirm' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'As senhas devem ser iguais' });
      }
      if (field === 'term' && !currentFieldValid) {
        control.setErrors({ ...control.errors, errorMessage: 'Aceite os termos para continuar.' });
      }

      if (index !== 0) {
        if (previousFieldValid) {
          console.log(field);

          control.enable();
        } else {
          control.disable();
          control.setValue('');
        }
      }
      if (!control.valid) {
        // check if the field is invalid and has been touched
        if (control.errors && (control.touched)) {
          // check if the field has a custom error message property
          if (control.errors.hasOwnProperty('customErrorMessageShown')) {
            // check if the error message for this field has already been shown
            if (control.errors['customErrorMessageShown']) {
              // control.setErrors({ ...control.errors, customErrorMessageShown: true });
              return;
            } else {
              control.setErrors({ ...control.errors, customErrorMessageShown: true });
            }
          }
          else {
            control.setErrors({ ...control.errors, customErrorMessageShown: true });
          }
        }
      } else {
        control.setErrors(null);
      }

      previousFieldValid = control.valid;
    });
  }
}
