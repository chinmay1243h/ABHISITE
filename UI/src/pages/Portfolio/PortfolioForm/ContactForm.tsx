import { Button, TextField, CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { portfolioContactSchema } from '../../../components/utils/schema';
import {
  editPortfolioContact,
  getPortfolioContact,
  insertPortfolioContact
} from '../../../services/services';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

interface ContactTabProps {
  onSubmit: (values: any) => void;
  profileId: string;
  isEditing?: boolean;
}

interface ContactFormValues {
  email: string;
  phoneNumber: string;
}

const ContactTab: React.FC<ContactTabProps> = ({
  onSubmit,
  profileId,
  isEditing = false
}) => {
  const [initialValues, setInitialValues] = useState<ContactFormValues>({
    email: '',
    phoneNumber: ''
  });
  const [existingContactId, setExistingContactId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch existing contact data when in edit mode
  useEffect(() => {
    if (isEditing && profileId) {
      getPortfolioContact(profileId)
        .then((res) => {
          const contactData = res?.data?.data;
          if (contactData) {
            setInitialValues({
              email: contactData.email || '',
              phoneNumber: contactData.phoneNumber || ''
            });
            setExistingContactId(contactData.id);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching contact details:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isEditing, profileId]);

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      const payload = {
        email: values.email,
        phoneNumber: values.phoneNumber,
        portfolioId: profileId
      };

      if (isEditing && existingContactId) {
        // Update existing contact
        await editPortfolioContact(existingContactId, payload);
        toast.success('Contact updated successfully!');
        navigate(-1)
      } else {
        // Create new contact
        await insertPortfolioContact(payload);
        toast.success('Contact added successfully!');
        navigate('/login');
      }
      onSubmit(profileId);
    } catch (err: any) {
      console.error("Error saving contact:", err);
      toast.error(err?.response?.data?.message || 'Failed to save contact');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={portfolioContactSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, isSubmitting }) => (
        <Form>
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            margin="normal"
            value={values.phoneNumber}
            onChange={handleChange}
            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Contact' : 'Save Contact')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ContactTab;