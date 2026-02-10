import React from 'react'
import Button from '@components/ui/Button'
import SectionEditor from './SectionEditor'

export default function EditableSection({ value = '', onSave = () => {}, title = 'Editar', children }) {
  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState(value)

  React.useEffect(() => setCurrent(value), [value])

  return (
    <div className="relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">{children}</div>
        <div className="ml-4">
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>Editar</Button>
        </div>
      </div>

      {open && (
        <SectionEditor
          title={title}
          initialValue={current}
          onCancel={() => setOpen(false)}
          onSave={(v) => {
            setOpen(false)
            setCurrent(v)
            onSave(v)
          }}
        />
      )}
    </div>
  )
}
