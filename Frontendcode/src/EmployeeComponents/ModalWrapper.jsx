import { Dialog } from '@headlessui/react';

export default function ModalWrapper({ open, onClose, children }) {
    const handleClose = (event) => {
        event.stopPropagation(); // Prevent closing when clicking inside the modal content
    };

    return (
        <Dialog open={open} onClose={() => {}} className="relative z-10">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Dialog.Panel
                        onClick={handleClose} // Prevent closing when clicking inside the modal content
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-2xl sm:w-full"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            {/*<div className="sm:flex sm:items-start">*/}
                            {/*    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">*/}
                            {/*        <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />*/}
                            {/*    </div>*/}
                            {/*    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">*/}
                            {/*        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">*/}
                            {/*            Access Restriction*/}
                            {/*        </Dialog.Title>*/}
                            {/*        <div className="mt-2">*/}
                            {/*            <p className="text-sm text-gray-500">*/}
                            {/*                Please select the Access role in the ProfessionalDetailsForm based on your role. Access for employees is limited, but the administrator will have unrestricted access. This move is lethal.*/}
                            {/*            </p>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>

                        <div className="px-4 py-3 sm:px-6">
                            {children}
                        </div>

                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
}

//comment
