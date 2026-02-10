import React from 'react'
import Button from '@components/ui/Button'

export default function SectionEditor({ title = 'Editar sección', initialValue = '', onSave, onCancel }) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => setValue(initialValue), [initialValue])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <textarea
          className="w-full min-h-[140px] p-3 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button onClick={() => onSave(value)}>Guardar</Button>
        </div>
      </div>
    </div>
  )
}
