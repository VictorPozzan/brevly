import { CreateLinkForm } from '../components/CreateLinkForm'
import { LinksList } from '../components/LinksList'
import brevlyLabel from '../assets/brev.ly-label.svg'

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-[980px] mx-auto">
        {/* logo */}
        <div className="mb-8">
          <img src={brevlyLabel} alt="brev.ly" className="h-8" />
        </div>

        {/* layout de duas colunas em desktop */}
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[380px] shrink-0">
            <CreateLinkForm />
          </div>

          <div className="w-full lg:w-[580px]">
            <LinksList />
          </div>
        </div>
      </div>
    </div>
  )
}
