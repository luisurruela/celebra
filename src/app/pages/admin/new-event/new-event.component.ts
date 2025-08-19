import { user } from '@angular/fire/auth';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'; // Se ha añadido ChangeDetectorRef

import { firstValueFrom, of, take } from 'rxjs';

import { EventService } from '../../../services/event.service';
import { Event } from '../../../types/event';

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
  loading = false; // Para el estado de envío del formulario
  isLoading = true; // Para el estado de carga inicial
  isEditing = false;
  
  newEventForm: FormGroup;
  currentTemplateFields: TemplateField[] = [];
  eventId: string | null = null;

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
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef // Inyectamos ChangeDetectorRef
  ) {
    this.newEventForm = this.fb.group({
      template: [null, Validators.required],
      details: this.fb.group({})
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    
    // Obtener el ID del evento de la ruta
    const params = await firstValueFrom(this.route.paramMap.pipe(take(1)));
    this.eventId = params.get('id');
    this.isEditing = !!this.eventId;

    // Verificar si el usuario está autenticado
    const user = await firstValueFrom(this.eventService.getUserAuth());
    
    // Si estamos editando y hay un usuario, cargar los datos
    if (this.isEditing && user) {
      const event = await this.eventService.getEventById(this.eventId!);
      if (event) {
        this.selectedTemplate = event.template;
        this.buildForm(event);
      } else {
        // En caso de que el ID no exista, inicializar como un evento nuevo
        this.selectedTemplate = null;
        this.buildForm();
      }
    } else {
      // Si es un evento nuevo, simplemente construir el formulario vacío
      this.selectedTemplate = null;
      this.buildForm();
    }
    
    this.isLoading = false;
    // Forzar la detección de cambios para que la vista se actualice
    this.cd.detectChanges();
  }

  buildForm(event?: Event) {
    const detailsGroup = this.fb.group({});
    
    if (this.selectedTemplate && (this.selectedTemplate in this.templates)) {
      this.currentTemplateFields = this.templates[this.selectedTemplate as keyof typeof this.templates];
      this.currentTemplateFields.forEach(field => {
        detailsGroup.addControl(field.name, new FormControl('', field.validators));
      });
    } else {
      this.currentTemplateFields = [];
    }
    
    this.newEventForm.setControl('details', detailsGroup);

    if (event) {
      this.newEventForm.patchValue({
        template: event.template,
        details: event
      });
    }
  }

  onTemplateSelect(template: string) {
    this.selectedTemplate = template;
    this.buildForm();
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
    
    // Limpia el 'id' del objeto eventData antes de enviarlo
    const { id, ...eventDataToSend } = eventData;

    try {
      if (this.isEditing && this.eventId) {
        await this.eventService.updateEvent({ ...eventDataToSend, id: this.eventId } as Event);
      } else {
        await this.eventService.addEvent(eventDataToSend as Event);
      }
      this.router.navigate(['/panel']);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    } finally {
      this.loading = false;
      this.newEventForm.enable();
    }
  }
}
