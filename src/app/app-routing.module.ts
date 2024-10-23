import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './component/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { PreAgendamentoComponent } from './pages/pre-agendamento/pre-agendamento.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ConfirmarAgendamentoComponent } from './pages/confirmar-agendamento/confirmar-agendamento.component';
import { PagamentoComponent } from './pages/pagamento/pagamento.component';
import { MedicosEEspecialistasComponent } from './pages/medicos-e-especialistas/medicos-e-especialistas.component';
import { ExamesComponent } from './pages/exames/exames.component';
import { MeusAgendamentosComponent } from './pages/meus-agendamentos/meus-agendamentos.component';
import { RelatorioAgendamentosComponent } from './pages/relatorio-agendamentos/relatorio-agendamentos.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AdminLayoutComponent } from './component/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './pages/admin/login/login.component';
import { MedicosComponent } from './pages/admin/medicos/medicos.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'consultas',
        component: ConsultasComponent
      },
      {
        path: 'medicos-e-especialistas',
        component: MedicosEEspecialistasComponent
      },
      {
        path: 'pre-agendamento',
        component: PreAgendamentoComponent
      },
      {
        path: 'cadastro',
        component: CadastroComponent
      },
      {
        path: 'confirmar-agendamento',
        component: ConfirmarAgendamentoComponent
      },
      {
        path: 'pagamento',
        component: PagamentoComponent
      },
      {
        path: 'exames',
        component: ExamesComponent
      },
      {
        path: 'meus-agendamentos',
        component: MeusAgendamentosComponent
      }
    ],
    component: HeaderComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login-adm',
    component: AdminLoginComponent
  },
  {
    path: 'redefinir-senha/:oobCode',
    component: ChangePasswordComponent
  },
  {
    path: 'admin', component: AdminLayoutComponent, children: [
      {
        path: 'medicos',
        component: MedicosComponent
      },
      {
        path: 'relatorio-agendamentos',
        component: RelatorioAgendamentosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
