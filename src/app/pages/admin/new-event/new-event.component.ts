import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { EventService } from '../../../services/event.service';

interface TemplateField {
  name: string;
  label: string;
  type: string;
  validators: ((control: AbstractControl<any, any, any>) => ValidationErrors | null)[];
}
@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {
  selectedTemplate: string | null = null;
  loading = false;
  
  newEventForm: FormGroup;
  currentTemplateFields: TemplateField[] = [];

  templates = {
    boda: [
      { name: 'nombresNovios', label: 'Nombres de los Novios', type: 'text', validators: [Validators.required] },
      { name: 'fecha', label: 'Fecha de la Boda', type: 'date', validators: [Validators.required] },
      { name: 'lugarCeremonia', label: 'Lugar de la Ceremonia', type: 'text', validators: [Validators.required] },
      { name: 'lugarRecepcion', label: 'Lugar de la Recepción', type: 'text', validators: [Validators.required] },
    ],
    cumpleanios: [
      { name: 'nombreFestejado', label: 'Nombre del Festejado', type: 'text', validators: [Validators.required] },
      { name: 'edad', label: 'Edad', type: 'number', validators: [Validators.required] },
      { name: 'fecha', label: 'Fecha del Cumpleaños', type: 'date', validators: [Validators.required] },
      { name: 'lugar', label: 'Lugar de la Fiesta', type: 'text', validators: [Validators.required] },
    ]
  }

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.newEventForm = this.fb.group({
      template: [null, Validators.required],
      details: this.fb.group({})
    });
  }

  ngOnInit() {
  }

  onTemplateSelect(template: string | null) {
    this.selectedTemplate = template;
    this.newEventForm.controls['template'].setValue(template);

    const detailsGroup = this.fb.group({});
    
    if (template && (template in this.templates)) {
      this.currentTemplateFields = this.templates[template as keyof typeof this.templates];
      this.currentTemplateFields.forEach(field => {
        detailsGroup.addControl(field.name, new FormControl('', field.validators));
      });
    } else {
      this.currentTemplateFields = [];
    }
    
    this.newEventForm.setControl('details', detailsGroup);
  }

  async onSubmit() {
    if (!this.newEventForm.valid) {
      this.newEventForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.newEventForm.disable();

    const template = this.newEventForm.get('template')?.value;
    const details = this.newEventForm.get('details')?.value;
    
    const eventData = {
      template,
      status: 'draft',
      ...details
    };

    this.eventService.addEvent(eventData)
      .then(() => {
        console.log('Datos enviados correctamente.');  
        this.newEventForm.reset();
        this.onTemplateSelect(this.selectedTemplate);
      }).catch(error => {
        console.error('Error al enviar los datos:', error);
        
      }).finally(() => {
        this.loading = false;
        this.newEventForm.enable();
        this.router.navigate(['/panel']);
      });
  }
}
