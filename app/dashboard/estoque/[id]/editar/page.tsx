export default function EstoqueEditarPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Editar Veiculo</h1>
      <p className="text-gray-600">ID: {params.id}</p>
    </div>
  )
}
