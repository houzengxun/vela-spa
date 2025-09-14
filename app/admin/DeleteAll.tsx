'use client';
export default function DeleteAll() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Delete ALL bookings?')) e.preventDefault();
  }
  return (
    <form action="/api/admin/delete-all" method="post" onSubmit={onSubmit}>
      <button className="btn secondary" type="submit">Delete all bookings</button>
    </form>
  );
}
