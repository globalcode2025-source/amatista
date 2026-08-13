export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'select' | 'textarea';
  options?: FieldOption[];
  required?: boolean;
  placeholder?: string;
  className?: string;
}

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange: (key: string, value: any) => void;
}

const baseClass =
  'w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none';

export function FormField({ field, value, onChange }: FormFieldProps) {
  if (field.type === 'select') {
    return (
      <label className={`block ${field.className ?? ''}`}>
        <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">{field.label}</span>
        <select
          className={baseClass}
          required={field.required}
          value={value ?? ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="" disabled>
            Selecciona...
          </option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className={`block ${field.className ?? ''}`}>
        <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">{field.label}</span>
        <textarea
          className={`${baseClass} min-h-[90px] resize-y`}
          required={field.required}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </label>
    );
  }

  return (
    <label className={`block ${field.className ?? ''}`}>
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">{field.label}</span>
      <input
        type={field.type}
        className={baseClass}
        required={field.required}
        placeholder={field.placeholder}
        value={value ?? ''}
          onChange={(e) => onChange(field.key, field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
      />
    </label>
  );
}

export default FormField;
