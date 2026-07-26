"use client";

type Form = {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
};

interface Props {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
}

export default function DepartmentFormFields({
  form,
  setForm,
}: Props) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Mã phòng ban
          <input
            value={form.code}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                code: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="HR001"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tên phòng ban
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                name: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="Phòng Nhân sự"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Mô tả
        <textarea
          value={form.description}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          rows={4}
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
          placeholder="Quản lý tuyển dụng, đào tạo và chế độ nhân viên"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              is_active: event.target.checked,
            }))
          }
          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
        />
        Hoạt động
      </label>
    </>
  );
}