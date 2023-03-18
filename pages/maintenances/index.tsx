import React, { useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import PageTitle from '../../components/PageTitle/PageTitle'
import MainButton from '../../components/MainButton/MainButton'
import ModalWrapper from '../../components/wrappers/ModalWrapper'
import ModalInput from '../../components/ModalInput/ModalInput'
import Table from '../../components/Table/Table'
import useInput from '../../hooks/use-input'
import axios from 'axios'
import env from '../../API/ApiUrl'
import { toast } from 'react-hot-toast'
import ReactPaginate from 'react-paginate'
import DeleteModal from '@components/Modals/DeleteModal'
import { useRouter } from 'next/router'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'


interface IMaintenanceProps {
  linkQuery: string
  page: string
}

axios.defaults.withCredentials = true;
const index = ({ linkQuery, page }: IMaintenanceProps) => {

  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [maintenances, setMaintenances] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  const [refetch, setRefetch] = React.useState<boolean>(false)
  const [totalLength, setTotalLength] = React.useState<number>(0)
  const [selectedMaintenance, setSelectedMaintenance] = React.useState<any>(null)
  const [selectedMaintenanceDetails, setSelectedMaintenanceDetails] = React.useState<any>(null)

  const [updating, setUpdating] = React.useState<boolean>(false)

  const [deleting, setDeleting] = React.useState<boolean>(false)
  const [currentPage, setCurrentPage] = React.useState<number>(page ? parseInt(page) : 1);
  const [query, setQuery] = React.useState<string>(linkQuery || '?limit=10');

  useEffect(() => {
    const getMaintenances = async () => {
      try {
        setLoading(true)
        console.log(linkQuery)
        const res = await axios.get(`${env.API_URL}/admin/maintenances${query ? `?${query}` : ''}`);

        setMaintenances(res?.data?.body)
        setTotalLength(res?.data?.totalLength)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || 'Something went wrong')
      }
      setLoading(false);
    }
    getMaintenances();
  }, [refetch, query])

  useEffect(() => {
    let query = '?limit=10'
    if (currentPage > 1)
      query += `&page=${currentPage}`
    const formattedQuery = new URLSearchParams(query).toString().replaceAll('+', '%20');
    setQuery(formattedQuery)

    if (formattedQuery)
      router.push(`/maintenances?${formattedQuery}`)
    else
      router.push(`/maintenances`)
  }, [currentPage])

  const handlePageClick = (e: any) => {
    setCurrentPage(e.selected + 1)
  };



  const {
    value: enteredPhone,
    isValid: enteredPhoneIsValid,
    hasError: phoneHasError,
    onChangeHandler: onChangePhoneHandler,
    setValueHandler: setPhoneValueHandler,
    onBlurHandler: onBlurPhoneHandler,
    resetInputHandler: resetPhoneInput
  } = useInput((value) => !!value.match(/^((\+2)?01[0125]\d{8})$/));

  const {
    value: enteredDeviceName,
    isValid: enteredDeviceNameIsValid,
    hasError: deviceNameHasError,
    onChangeHandler: onChangeDeviceNameHandler,
    setValueHandler: setDeviceNameValueHandler,
    onBlurHandler: onBlurDeviceNameHandler,
    resetInputHandler: resetDeviceNameInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredModel,
    isValid: enteredModelIsValid,
    hasError: modelHasError,
    onChangeHandler: onChangeModelHandler,
    setValueHandler: setModelValueHandler,
    onBlurHandler: onBlurModelHandler,
    resetInputHandler: resetModelInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredSerialNumber,
    isValid: enteredSerialNumberIsValid,
    hasError: serialNumberHasError,
    onChangeHandler: onChangeSerialNumberHandler,
    setValueHandler: setSerialNumberValueHandler,
    onBlurHandler: onBlurSerialNumberHandler,
    resetInputHandler: resetSerialNumberInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredProblem,
    isValid: enteredProblemIsValid,
    hasError: problemHasError,
    onChangeHandler: onChangeProblemHandler,
    setValueHandler: setProblemValueHandler,
    onBlurHandler: onBlurProblemHandler,
    resetInputHandler: resetProblemInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredCost,
    isValid: enteredCostIsValid,
    hasError: costHasError,
    onChangeHandler: onChangeCostHandler,
    setValueHandler: setCostValueHandler,
    onBlurHandler: onBlurCostHandler,
    resetInputHandler: resetCostInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredStatus,
    isValid: enteredStatusIsValid,
    hasError: statusHasError,
    onChangeHandler: onChangeStatusHandler,
    setValueHandler: setStatusValueHandler,
    onBlurHandler: onBlurStatusHandler,
    resetInputHandler: resetStatusInput
  } = useInput((value) => value.trim().length > 0);

  let formIsValid = false;
  if (
    (enteredPhoneIsValid) &&
    enteredDeviceNameIsValid &&
    enteredModelIsValid &&
    enteredSerialNumberIsValid &&
    enteredProblemIsValid &&
    (updating ? enteredCostIsValid : true) &&
    (updating ? enteredStatusIsValid : true)
  )
    formIsValid = true;
  const resetFormHandler = () => {
    resetPhoneInput();
    resetDeviceNameInput();
    resetModelInput();
    resetSerialNumberInput();
    resetProblemInput();
    resetCostInput();
    resetStatusInput();
  }
  const touchFormHandler = () => {
    onBlurPhoneHandler();
    onBlurDeviceNameHandler();
    onBlurModelHandler();
    onBlurSerialNumberHandler();
    onBlurProblemHandler();
    onBlurCostHandler();
    onBlurStatusHandler();
  }
  useEffect(() => {
    if (!isOpen && !updating)
      resetFormHandler();

  }, [isOpen, updating])

  const onChangeCostValidationHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*$/)) {
      onChangeCostHandler(e as any);
    } else {
      return;
    }
  }

  const updateButtonHandler = (id: string) => {
    setUpdating(true)
    setSelectedMaintenance(id)
    const maintenance = maintenances.find((maintenance: any) => maintenance._id === id)

    setSelectedMaintenanceDetails(maintenance);
    setPhoneValueHandler(maintenance.phone)
    setDeviceNameValueHandler(maintenance.deviceName)
    setModelValueHandler(maintenance.model)
    setSerialNumberValueHandler(maintenance.serialNumber)
    setProblemValueHandler(maintenance.problem)
    setCostValueHandler(maintenance.cost)
    setStatusValueHandler(`${maintenance.status}`)


  }
  const deleteButtonHandler = (id: string) => {
    setDeleting(true)
    setSelectedMaintenance(id)
    console.log(id)
    console.log(deleting)
  }


  const addMaintenanceHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //touch form to show errors
    touchFormHandler();

    if (!formIsValid)
      return;

    //send data to server
    console.log('submitting form');

    const notification = toast.loading('Adding Maintenance...');
    try {
      const req = axios.post(`${env.API_URL}/admin/maintenances`, {
        phone: enteredPhone,
        deviceName: enteredDeviceName,
        model: enteredModel,
        serialNumber: enteredSerialNumber,
        problem: enteredProblem,
        cost: enteredCost || 0,
      })
      const res = await req;
      console.log(res.data);
      toast.dismiss(notification);
      toast.success('Maintenance Added Successfully');
      setIsOpen(false);
      setRefetch(prev => !prev);
      resetFormHandler();
    }
    catch (e) {
      console.log(e)
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
  }

  const updateMaintenanceHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //touch form to show errors
    touchFormHandler();

    if (!formIsValid)
      return;

    //send data to server
    console.log('submitting form');

    const notification = toast.loading('Updating Maintenance...');
    try {
      const req = axios.patch(`${env.API_URL}/admin/maintenances/${selectedMaintenance}`, {
        deviceName: enteredDeviceName,
        model: enteredModel,
        serialNumber: enteredSerialNumber,
        problem: enteredProblem,
        cost: enteredCost,
        status: enteredStatus
      })
      const res = await req;
      console.log(res.data);
      toast.dismiss(notification);
      toast.success('Maintenance Updated Successfully');
      setUpdating(false);
      setRefetch(prev => !prev);
      resetFormHandler();
    }
    catch (e) {
      console.log(e)
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
  }

  const deleteMaintenanceHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const notification = toast.loading('Deleting Maintenance...');
    try {
      setDeleting(false);
      const req = axios.delete(`${env.API_URL}/admin/maintenances/${selectedMaintenance}`)
      await req;
      toast.dismiss(notification);
      toast.success('Maintenance Deleted Successfully');
      setRefetch(prev => !prev);
    }
    catch (e) {
      console.log(e)
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
  }
  return (
    <DashboardLayout>
      <div className="max-sm:px-4 flex flex-col gap-6  sm:flex-row sm:justify-between sm:items-center">
        <PageTitle title='Maintenances' total={totalLength} />
        <MainButton bg='bg-black max-sm:w-fit'
          rest={{
            onClick: () => setIsOpen(true),
            type: 'button'
          }}
        >
          <span className='text-base'>Add Maintenance</span>
          <span className='ml-2 text-2xl'>+</span>
        </MainButton>
      </div>

      {
        (isOpen || updating) && (
          <ModalWrapper title='Add Maintenance'
            closeHandler={
              () => {
                setIsOpen(false)
                setUpdating(false)
              }
            }
          >
            <div className="px-2">
              <div className='pt-2'>
                <h2 className='text-2xl text-stone-600'>User Data</h2>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  {/* <ModalInput label='Username' name='username' variant='filled' required={true} /> */}
                  {/* <ModalInput label='Email' name='email' variant='filled' required={true} /> */}
                  <ModalInput
                    label='Phone'
                    name='phone'
                    variant='filled'
                    required={true}
                    value={enteredPhone}
                    onChange={onChangePhoneHandler}
                    onBlur={onBlurPhoneHandler}
                    error={phoneHasError}
                    helperText={phoneHasError ? 'Phone is not valid' : ''}
                    disabled={updating}
                  />
                </div>
              </div>


              <div>
                <h2 className='text-2xl text-stone-600'>Device Data</h2>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <ModalInput
                    label='Device Name'
                    name='deviceName'
                    variant='filled'
                    required={true}
                    value={enteredDeviceName}
                    onChange={onChangeDeviceNameHandler}
                    onBlur={onBlurDeviceNameHandler}
                    error={deviceNameHasError}
                    helperText={deviceNameHasError ? 'This field is required' : ''}
                  />
                  <ModalInput label='Model'
                    name='model'
                    variant='filled'
                    required={true}
                    value={enteredModel}
                    onChange={onChangeModelHandler}
                    onBlur={onBlurModelHandler}
                    error={modelHasError}
                    helperText={modelHasError ? 'This field is required' : ''}
                  />
                  <ModalInput label='Serial'
                    name='serial'
                    variant='filled'
                    required={true}
                    value={enteredSerialNumber}
                    onChange={onChangeSerialNumberHandler}
                    onBlur={onBlurSerialNumberHandler}
                    error={serialNumberHasError}
                    helperText={serialNumberHasError ? 'This field is required' : ''}
                  />
                  <ModalInput label='Problem'
                    name='problem'
                    variant='filled'
                    required={true}
                    value={enteredProblem}
                    onChange={onChangeProblemHandler}
                    onBlur={onBlurProblemHandler}
                    error={problemHasError}
                    helperText={problemHasError ? 'This field is required' : ''}
                  />
                  <ModalInput label='Cost'
                    name='cost'
                    variant='filled'
                    value={enteredCost}
                    onChange={onChangeCostValidationHandler}
                    onBlur={onBlurCostHandler}
                    error={updating && costHasError}
                    helperText={(updating && costHasError) ? 'This field is required' : ''}
                  />
                  {
                    updating && (
                      <FormControl fullWidth variant="filled" >
                        <InputLabel id="statusLabel">Status</InputLabel>
                        <Select
                          labelId="statusLabel"
                          id="status"
                          value={enteredStatus}
                          label="Status"
                          onChange={onChangeStatusHandler}
                          onBlur={onBlurStatusHandler}
                          error={statusHasError}
                        >
                          <MenuItem className='h-11' value={'-1'} >Canceled By Customer</MenuItem>
                          <MenuItem className='h-11' value={'0'} disabled={selectedMaintenanceDetails?.status > 0}>Under Maintenance</MenuItem>
                          <MenuItem className='h-11' value={'1'} disabled={selectedMaintenanceDetails?.status > 1}>Repaired</MenuItem>
                          <MenuItem className='h-11' value={'2'} disabled={selectedMaintenanceDetails?.status > 2}>In Shipping</MenuItem>
                          <MenuItem className='h-11' value={'3'} disabled={selectedMaintenanceDetails?.status >= 3}>Delivered</MenuItem>
                        </Select>
                      </FormControl>
                    )
                  }


                </div>
              </div>
              <div className='flex justify-end items-center'>

                <MainButton bg='bg-green-600 duration-300 hover:bg-green-500 hover:bg-opacity-80 hover:shadow-lg'
                  rest={{
                    onClick: (e: any) => isOpen ? addMaintenanceHandler(e as any) : updateMaintenanceHandler(e as any),
                    type: 'button'
                  }}
                >
                  <span className='text-base'>{isOpen ? 'Add' : 'Update'}</span>
                </MainButton>
              </div>
            </div>

          </ModalWrapper>
        )
      }

      <Table
        heads={[
          { title: 'ID', key: '_id' },
          { title: 'Username', key: 'username' },
          { title: 'Email Address', key: 'email' },
          { title: 'Phone', key: 'phone' },
          { title: 'Status', key: 'status' },
          { title: 'Device Name', key: 'deviceName' },
          { title: 'Model', key: 'model' },
          { title: 'Serial', key: 'serialNumber' },
          { title: 'Problem', key: 'problem' },
          { title: 'Cost', key: 'cost' },
          { title: 'Created At', key: 'createdAt' },
          { title: 'Actions', key: 'actions' },
        ]}
        items={maintenances}
        onClickUpdate={updateButtonHandler}
        onClickDelete={deleteButtonHandler}
        type="maintenance"
      />

      {
        deleting && (
          <DeleteModal
            title='Delete Maintenance'
            closeHandler={() => setDeleting(false)}
            deleteHandler={deleteMaintenanceHandler}
          />
        )
      }

      <div className="">

        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <span className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
              <span>
                Next
              </span>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </span>
          }
          previousLabel={
            <span className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>

              <span>
                previous
              </span>
            </span>
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={Math.ceil(totalLength / 10)}
          renderOnZeroPageCount={undefined}
          initialPage={currentPage - 1}
          containerClassName='flex items-center justify-center mt-6 w-full gap-1'

          pageLinkClassName='px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100 duration-150'

          activeLinkClassName='px-2 py-1 text-sm text-blue-500 rounded-md hover:bg-blue-100/60 bg-blue-100/60'
          nextClassName='flex flex-1 justify-end'
          previousClassName='flex flex-1'

        // previousLinkClassName='text-white hover:text-gray-200 bg-red-500 h-8 w-8 rounded-md flex justify-center items-center duration-300 hover:bg-red-400 cursor-pointer'

        // nextLinkClassName='text-white hover:text-gray-200 bg-red-500 h-8 w-8 rounded-md flex justify-center items-center duration-300 hover:bg-red-400 cursor-pointer'
        />
      </div>


      {/* <div className="flex items-center justify-between mt-6">
        <a href="#" className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>

          <span>
            previous
          </span>
        </a>



        <div className="items-center hidden lg:flex gap-x-3">
          <a href="#" className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60">1</a>
          <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">2</a>
          <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">...</a>
          <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">7</a>
        </div>

        <a href="#" className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
          <span>
            Next
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </a>
      </div> */}

    </DashboardLayout>
  )
}

export default index



export async function getServerSideProps(context: any) {
  try {
    const { query } = context
    const formattedQuery = new URLSearchParams(query).toString().replaceAll('+', '%20')
    await axios.get(`${env.API_URL}/admin/auth`, {
      headers: {
        Cookie: context.req.headers.cookie,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    })
    if (formattedQuery)
      return {
        props: {
          linkQuery: formattedQuery,
          page: query?.page || null
        },
      }
    return {
      props: {},
    }
  } catch (e) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: {},
    };
  }
}