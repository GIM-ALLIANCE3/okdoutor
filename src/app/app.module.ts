import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { StyleClassModule } from 'primeng/styleclass';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { HomeComponent } from './pages/home/home.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PreAgendamentoComponent } from './pages/pre-agendamento/pre-agendamento.component';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { LoginComponent } from './pages/login/login.component';
import { PasswordModule } from 'primeng/password';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ConfirmarAgendamentoComponent } from './pages/confirmar-agendamento/confirmar-agendamento.component';
import { DialogModule } from 'primeng/dialog';
import { PagamentoComponent } from './pages/pagamento/pagamento.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClientModule } from '@angular/common/http';
import { MedicosEEspecialistasComponent } from './pages/medicos-e-especialistas/medicos-e-especialistas.component';
import { ExamesComponent } from './pages/exames/exames.component';
import { MeusAgendamentosComponent } from './pages/meus-agendamentos/meus-agendamentos.component';
import { AuthInterceptorProvider } from './service/auth.interceptor';
import { RelatorioAgendamentosComponent } from './pages/relatorio-agendamentos/relatorio-agendamentos.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ValorBrPipe } from './pipe/valor-br.pipe';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AdminLoginComponent } from './pages/admin/login/login.component';
import { AdminLayoutComponent } from './component/admin-layout/admin-layout.component';
import { MedicosComponent } from './pages/admin/medicos/medicos.component';
import { EditorModule } from 'primeng/editor';
import { RippleModule } from 'primeng/ripple';
import { DialogService } from 'primeng/dynamicdialog';
import { FormatCpfPipe } from './pipe/format-cpf.pipe';
import { DoutorPipe } from './pipe/doutor.pipe';

const initializeAppFactory = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ConsultasComponent,
    NotFoundComponent,
    PreAgendamentoComponent,
    LoginComponent,
    CadastroComponent,
    ConfirmarAgendamentoComponent,
    PagamentoComponent,
    MedicosEEspecialistasComponent,
    ExamesComponent,
    MeusAgendamentosComponent,
    RelatorioAgendamentosComponent,
    ValorBrPipe,
    FormatCpfPipe,
    ChangePasswordComponent,
    AdminLoginComponent,
    AdminLayoutComponent,
    DoutorPipe,
    MedicosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StyleClassModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SidebarModule,
    BrowserAnimationsModule,
    DropdownModule,
    BadgeModule,
    CarouselModule,
    CardModule,
    ReactiveFormsModule,
    PasswordModule,
    InputMaskModule,
    CheckboxModule,
    DividerModule,
    DialogModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    HttpClientModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    EditorModule,
    RippleModule,
  ],
  providers: [AuthInterceptorProvider, MessageService, ConfirmationService, DialogService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
