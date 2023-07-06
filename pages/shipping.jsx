import React, { useContext, useEffect,useState  } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import CheckoutWizard from '@/components/CheckoutWizard';
import { store} from "@/slices/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';


const ShippingScreen = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();


  const dispatch = useDispatch()
  const router = useRouter();

  const cart = useSelector(state => state.cart)
  // const cart = useSelector((state) => state.cart);

    const { shippingAddress } = cart



  // const [address, setAddress] = useState(shippingAddress.address)
  // const [city, setCity] = useState(shippingAddress.city)
  // const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  // const [country, setCountry] = useState(shippingAddress.country)

  // useEffect(() => {
  //   setValue('fullName', shippingAddress.fullName);
  //   setValue('address', shippingAddress.address);
  //   setValue('city', shippingAddress.city);
  //   setValue('phone', shippingAddress.phone);
  //   setValue('country', shippingAddress.country);
  // }, [setValue, shippingAddress]);

  // const submitHandler = ({ fullName, address, city, phone, country }) => {
  //   dispatch({
  //     type: 'SAVE_SHIPPING_ADDRESS',
  //     payload: { fullName, address, city, phone, country },
  //   });
  //   Cookies.set(
  //     'cart',
  //     JSON.stringify({
  //       ...cart,
  //       shippingAddress: {
  //         fullName,
  //         address,
  //         city,
  //         phone,
  //         country,
  //       },
  //     })
  //   );

  //   router.push('/payment');
  // };
  return (
    <>
    <CheckoutWizard activeStep={1} />
    <form
      className="mx-auto max-w-screen-md"
      // onSubmit={handleSubmit(submitHandler)}
    >
      <h1 className="mb-4 text-xl">Shipping Address</h1>
      <div className="mb-4">
        <label htmlFor="fullName">Full Name</label>
        <input
          className="w-full"
          id="fullName"
          autoFocus
          {...register('fullName', {
            required: 'Please enter full name',
          })}
        />
        {errors.fullName && (
          <div className="text-red-500">{errors.fullName.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="address">Address</label>
        <input
          className="w-full"
          id="address"
          {...register('address', {
            required: 'Please enter address',
            minLength: { value: 3, message: 'Address is more than 2 chars' },
          })}
        />
        {errors.address && (
          <div className="text-red-500">{errors.address.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="city">City</label>
        <input
          className="w-full"
          id="city"
          {...register('city', {
            required: 'Please enter city',
          })}
        />
        {errors.city && (
          <div className="text-red-500 ">{errors.city.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Phone number</label>
        <input
          className="w-full"
          id="phone"
          {...register('phone', {
            required: 'Please enter valid phone number',
          })}
        />
        {errors.phone && (
          <div className="text-red-500 ">{errors.phone.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="country">Country</label>
        <input
          className="w-full"
          id="country"
          {...register('country', {
            required: 'Please enter country',
          })}
        />
        {errors.country && (
          <div className="text-red-500 ">{errors.country.message}</div>
        )}
      </div>
      <div className="mb-4 flex justify-between">
        <button className="primary-button">Next</button>
      </div>
    </form>
  </>
  )
}
ShippingScreen.auth = true;
export default ShippingScreen