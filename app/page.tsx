import NavigationHeader from "@/components/NavigationHeader";
import InputForm from "@/components/InputForm";
export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen px-4 sm:px-1 font-[family-name:var(--font-geist-sans)]">
      <NavigationHeader />
      <main className="flex flex-col gap-8 items-center sm:items-start py-2">
        <InputForm />
      </main>
    </div>
  );
}
