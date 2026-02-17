export default function AnuncioEditarPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Editar Anuncio</h1>
      <p className="text-gray-600">ID: {params.id}</p>
    </div>
  )
}
