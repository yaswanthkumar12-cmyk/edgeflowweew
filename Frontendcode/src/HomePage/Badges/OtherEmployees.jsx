import { PlusIcon} from "@heroicons/react/16/solid";

const OtherEmployees=(props)=>{
const {member, badgeCreate}=props
const {email, imageUrl, name, role}=member
const addBadge=()=>{
    badgeCreate(email)
}

return (<li key={email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={imageUrl} alt="" />
              <div className="min-w-0 flex-auto">
                <p className="text-xl font-semibold leading-6 text-gray-900">{name}</p>
                <p className="mt-1 truncate text-xl leading-5 text-gray-500">{email}</p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-xl leading-6 text-gray-900">{role}</p>
            </div>
            <div>
            <button
                        onClick={addBadge}
                        type="button"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-8 w-8" aria-hidden="true"/>
                        Add Badge
                    </button>
            </div>
          </li>)
}

export default OtherEmployees








