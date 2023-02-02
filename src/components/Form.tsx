import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch } from '../app/hook';
import { changeColor } from '../redux/colorSlice';
import PhotoModal from './PhotoModal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Uploader } from 'uploader'; // Installed by "react-uploader".
import { UploadDropzone } from 'react-uploader';

export interface Country {
  name: string;
  callingCodes: [string];
}

// interface FormInput {
//   username: string;
//   password: string;
//   profile: { about: string; color: string; photo: string; cover: string[] };
//   personalInformation: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     birthday: string;
//     country: string;
//     phone: string;
//     url: string;
//     streetAddress: string;
//     city: string;
//     region: string;
//     postalCode: string;
//   };
//   notifications: {
//     comments: string;
//     candidates: string;
//     offers: string;
//     pushNotifications: string;
//   };
//   feedback: { rating: string; experience: string };
// }

const schema = z.object({
  username: z.string().max(5),
  password: z.string(),
  about: z.string(),
  color: z.string(),
  photo: z.string(),
  cover: z.array(z.string()),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  birthday: z.string(),
  country: z.string(),
  phone: z.string(),
  url: z.string().url(),
  streetAddress: z.string(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  comments: z.boolean().optional(),
  candidates: z.boolean().optional(),
  offers: z.boolean().optional(),
  pushNotifications: z.string(),
  rating: z.string(),
  experience: z.string(),
});
type FormData = z.infer<typeof schema>;

export default function Form() {
  const [data, setData] = useState<Country[]>([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [color, setColor] = useState('#1F2937');
  const [photo, setPhoto] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [country, setCountry] = useState('Afghanistan');
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  const satisfactionArray = [3, 4, 5, 6, 7, 8];

  const uploader = Uploader({
    apiKey: 'free', // Get production API keys from Upload.io
  });
  const options = {
    multi: false,
    styles: {
      fontSizes: {
        base: 14,
      },
    },
  };

  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);
  const debounceValue = useDebounceValue(color);

  function useDebounceValue(value: string, time = 100) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebounceValue(value);
      }, time);

      return () => {
        clearTimeout(timeout);
      };
    }, [value, time]);

    return debounceValue;
  }

  useEffect(() => {
    const getData = async () => {
      await fetch('https://restcountries.com/v2/all?fields=name,callingCodes')
        .then((response) => response.json())
        .then((data) => setData(data));
    };
    getData();
  }, []);

  useEffect(() => {
    dispatch(changeColor(debounceValue));
  }, [debounceValue, dispatch]);

  let coverPhoto: string[] = [];

  let callingCode = '';
  const currentCountry = data.find((obj) => obj.name === country);
  if (currentCountry) {
    callingCode = currentCountry.callingCodes[0];
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        {openModal && <PhotoModal open={openModal} setOpen={setOpenModal} setPhoto={setPhoto} />}
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Account information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This information is necessary for you to be able to log in later.
            </p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Username
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div
                  className={`flex max-w-lg flex-col rounded-md ${
                    errors.username?.message ? 'shadow-none' : 'shadow-sm'
                  }`}
                >
                  <input
                    {...register('username')}
                    type="text"
                    id="username"
                    autoComplete="username"
                    className="block w-full min-w-0 flex-1  rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.username?.message && (
                    <p className="mt-1  text-xs font-medium tracking-wide  text-red-500">{errors.username?.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Password
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="relative max-w-lg rounded-md shadow-sm">
                  <input
                    {...register('password')}
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    autoComplete="password"
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={togglePasswordVisible}
                  >
                    {!passwordVisible ? (
                      <EyeSlashIcon className="text-primary-900 h-5 w-5" />
                    ) : (
                      <EyeIcon className="text-primary-900 h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                About
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  {...register('about')}
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full max-w-lg rounded-md border-gray-300  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={''}
                />
                <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Color preference
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <div className="relative inline-block h-12 w-12 overflow-hidden rounded-full">
                    <input
                      {...register('color')}
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="absolute -top-2 -right-2 m-0 block h-16 w-16 rounded-full border-none p-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="photo" className=" bg-[#4037bd]block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <span className="h-fit w-16 overflow-hidden rounded-full bg-gray-100">
                    {photo ? (
                      <img {...register('photo', { value: photo })} alt={`${photo}`} src={photo} />
                    ) : (
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                  <button
                    onClick={() => setOpenModal(true)}
                    type="button"
                    className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Cover photo
              </label>
              <UploadDropzone
                {...register('cover', { value: coverPhoto })}
                uploader={uploader}
                options={options}
                onUpdate={(files) => coverPhoto.push(files[0].fileUrl)}
                width="200px"
                height="200px"
              />
            </div>
          </div>
        </div>
        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                First name
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('firstName')}
                  type="text"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Last name
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('lastName')}
                  type="text"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Email address
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Birthday
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('birthday')}
                  id="birthday"
                  type="date"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Country
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <select
                  {...register('country')}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  id="country"
                  autoComplete="country-name"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                >
                  {data.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Phone number
              </label>
              <div className="mt-1 flex sm:col-span-2 sm:mt-0">
                <div className="inline-flex w-14 items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  +{callingCode}
                </div>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="block w-full max-w-lg rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-[266px] sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Portfolio page
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('url')}
                  type="url"
                  id="url"
                  placeholder="https://example.com"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Street address
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('streetAddress')}
                  type="text"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full max-w-lg  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                City
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('city')}
                  type="text"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                State / Province
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('region')}
                  type="text"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                ZIP / Postal code
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  {...register('postalCode')}
                  type="text"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 divide-gray-200  pt-8 sm:space-y-5 sm:divide-y  sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              We'll always let you know about important changes, but you pick what else you want to hear about.
            </p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="pt-6 sm:pt-5">
              <div role="group" aria-labelledby="label-email">
                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                  <div>
                    <div className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700" id="label-email">
                      By Email
                    </div>
                  </div>
                  <div className="mt-4 sm:col-span-2 sm:mt-0">
                    <div className="max-w-lg space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('comments')}
                            id="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="comments" className="font-medium text-gray-700">
                            Comments
                          </label>
                          <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('candidates')}
                            id="candidates"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="candidates" className="font-medium text-gray-700">
                            Candidates
                          </label>
                          <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('offers')}
                            id="offers"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="offers" className="font-medium text-gray-700">
                            Offers
                          </label>
                          <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 sm:pt-5">
              <div role="group" aria-labelledby="label-notifications">
                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                  <div>
                    <div
                      className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                      id="label-notifications"
                    >
                      Push Notifications
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="max-w-lg">
                      <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            {...register('pushNotifications')}
                            id="push-everything"
                            type="radio"
                            value="push-everything"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                            Everything
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            {...register('pushNotifications')}
                            id="push-email"
                            type="radio"
                            value="push-email"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                            Same as email
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            {...register('pushNotifications')}
                            id="push-nothing"
                            type="radio"
                            value="push-nothing"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                            No push notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6  pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Feedback</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Data will be used to gather information about a user's experience with a product.
            </p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="satisfaction" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Satisfaction with form styling
              </label>
              <div className="flex w-full max-w-lg flex-col space-y-2 p-2 sm:max-w-xs">
                <input {...register('rating')} type="range" className="w-full" min="3" max="8" step="1" />
                <ul className="flex w-full justify-between px-2">
                  {satisfactionArray.map((rating) => (
                    <li key={rating} className="relative flex justify-center">
                      <span className="absolute text-sm">{rating}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Overall experience
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <input
                {...register('experience')}
                type="number"
                name="experience"
                id="experience"
                min="5"
                max="13"
                placeholder="5 to 13"
                className="block w-fit max-w-lg  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
