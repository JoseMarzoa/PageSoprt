import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { BenefitsSectionComponent } from './components/benefits-section/benefits-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { ProductosComponent } from './components/productos/productos.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminComponent } from './components/admin/admin.component';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'acerca-de-nosotros', component: AboutUsComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    HeroCarouselComponent,
    ProductCardComponent,
    BenefitsSectionComponent,
    FooterComponent,
    RegisterModalComponent,
    ProductosComponent,
    EditProfileComponent,
    AboutUsComponent,
    ContactComponent,
    AdminComponent,
    ThemeSelectorComponent,
    ClickOutsideDirective,
    CartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 