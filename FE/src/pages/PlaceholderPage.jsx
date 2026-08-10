export default function PlaceholderPage({ title }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg shadow-sm">
      <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">{title}</h2>
      <p className="font-body-md text-on-surface-variant">Màn hình này sẽ được xây dựng ở giai đoạn tiếp theo.</p>
    </div>
  );
}
