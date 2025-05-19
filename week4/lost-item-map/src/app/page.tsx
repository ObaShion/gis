
import { LostItemMap } from "@/components/lost-item-map";


export default function Home() {

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">落とし物マップ</h1>
      </header>
      <main className="max-w-7xl mx-auto">
        <LostItemMap />
      </main>
    </div>
  );
}
