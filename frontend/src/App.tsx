import {Button} from "@/components/ui/button.tsx";

function App() {
  return (
    <div className="flex h-screen w-full bg-zinc-50">
      <aside className="w-80 bg-white border-r p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-zinc-900">Smart Finder</h1>
        <p className="text-sm text-zinc-500">Znajdź najbliższy paczkomat w swojej okolicy.</p>

        <Button>Szukaj paczkomatów</Button>
      </aside>

      <main className="flex-1 bg-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Map</p>
      </main>
    </div>
  );
}

export default App;