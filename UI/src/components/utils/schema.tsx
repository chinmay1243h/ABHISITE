import * as Yup from "yup";


const signupSchema = Yup.object({
  firstName: Yup.string()
    .min(3, "First Name must be at least 3 characters")
    .required("First Name is Required"),

  lastName: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .required("Last Name is Required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is Required"),
});

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is Required"),
});

const forgotPwdSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

const resetPwdSchema = Yup.object({
  VerifyOtp: Yup.string().min(6, 'OTP must be at least 6 characters').required('OTP is Required'),

});
const ProfileSchema = Yup.object().shape({
  tagline: Yup.string().required().max(50, "Maximum 50 characters"),
  about: Yup.string().required(),
  artistCategory: Yup.string().required(),
  experience: Yup.array().of(
    Yup.object().shape({
      title: Yup.string(),
      dateRange: Yup.object().shape({
        from: Yup.number(),
        to: Yup.number(),
      }),
      description: Yup.string(),
    })
  ),
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string(),
      instituteName: Yup.string(),
      year: Yup.number(),
      location: Yup.string(),
    })
  ),
});
const portfolioContactSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
});



export {
  signupSchema, loginSchema, forgotPwdSchema,
  resetPwdSchema, ProfileSchema, portfolioContactSchema
};
