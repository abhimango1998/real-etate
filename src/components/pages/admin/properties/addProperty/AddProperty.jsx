"use client";

// React Imports
import { useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

// Third-party Imports
import { toast } from "react-toastify";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Component Imports
import DirectionalIcon from "@components/DirectionalIcon";
import CustomTextField from "@core/components/mui/TextField";

// Styled Component Imports
import StepperWrapper from "@core/styles/stepper";
import StepperCustomDot from "@components/stepper-dot";

// Validation Schema
const generalInfoSchema = yup.object().shape({
  property_type: yup.string().required("Property type is required"),
  property_sub_type: yup.string().required("Property sub-type is required"),
  structure_type: yup.string().required("Structure type is required"),
  street_address: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postal_code: yup
    .string()
    .required("Postal code is required")
    .matches(/^\d{5}(-\d{4})?$/, "Invalid postal code format"),
  is_featured: yup.boolean(),
  is_imported: yup.boolean(),
});

const propertyDetailsSchema = yup.object().shape({
  bedrooms: yup
    .number()
    .required("Number of bedrooms is required")
    .min(0, "Cannot be negative"),
  bathrooms: yup
    .number()
    .required("Number of bathrooms is required")
    .min(0, "Cannot be negative"),
  year_built: yup
    .number()
    .required("Year built is required")
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  building_area: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  lot_size: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  parking_spaces: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  waterfront: yup.boolean(),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  status: yup.string().required("Status is required"),
  list_price: yup
    .number()
    .required("List price is required")
    .min(0, "Price cannot be negative"),
  agent_name: yup.string().required("Agent name is required"),
  agent_email: yup
    .string()
    .required("Agent email is required")
    .email("Invalid email format"),
  agent_phone: yup
    .string()
    .required("Agent phone is required")
    .matches(/^[0-9\-+() ]+$/, "Invalid phone number format"),
  agent_id: yup.string(),
});

const mediaSchema = yup.object().shape({
  media: yup.array().min(1, "At least one image is required"),
});

const amenitiesSchema = yup.object().shape({
  amenities: yup.array().min(0),
});

// Combined schema for all steps
const validationSchema = yup.object().shape({
  ...generalInfoSchema.fields,
  ...propertyDetailsSchema.fields,
  ...mediaSchema.fields,
  ...amenitiesSchema.fields,
});

// Vars
const steps = [
  {
    title: "General Info",
    subtitle: "Add general info of your property",
  },
  {
    title: "Additional Info",
    subtitle: "Add additional info of your property",
  },
  {
    title: "Media Details",
    subtitle: "Add media of your property",
  },
  {
    title: "Amenities",
    subtitle: "Add amenities of your property",
  },
  {
    title: "Summary",
    subtitle: "Review your details",
  },
];

const propertyTypes = [
  { value: "ResidentialLease", label: "Residential Lease" },
  { value: "ResidentialSale", label: "Residential Sale" },
  { value: "CommercialLease", label: "Commercial Lease" },
  { value: "CommercialSale", label: "Commercial Sale" },
];

const propertySubTypes = [
  { value: "Apartment", label: "Apartment" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "House", label: "House" },
  { value: "Condo", label: "Condo" },
  { value: "Office", label: "Office" },
  { value: "Retail", label: "Retail" },
];

const structureTypes = [
  { value: "Unknown", label: "Unknown" },
  { value: "Detached", label: "Detached" },
  { value: "SemiDetached", label: "Semi-Detached" },
  { value: "Attached", label: "Attached" },
];

const commonAmenities = [
  { id: 22, name: "Pool", category: "Community" },
  { id: 58, name: "Clubhouse", category: "Community" },
  { id: 23, name: "Tennis Court", category: "Community" },
  { id: 24, name: "Gym", category: "Community" },
  { id: 25, name: "Parking", category: "Property" },
  { id: 26, name: "Balcony", category: "Property" },
  { id: 27, name: "Washer/Dryer", category: "Property" },
  { id: 28, name: "Dishwasher", category: "Property" },
];

const AddProperty = () => {
  // States
  const [activeStep, setActiveStep] = useState(0);

  // Initialize react-hook-form
  const methods = useForm({
    // resolver: yupResolver(validationSchema),
    defaultValues: {
      // General Info
      property_type: "ResidentialLease",
      property_sub_type: "Townhouse",
      category_id: 9,
      structure_type: "Unknown",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      address: "",
      latitude: null,
      longitude: null,
      is_featured: false,
      is_imported: false,

      // Property Details
      bedrooms: 0,
      bathrooms: 0,
      year_built: "",
      building_area: null,
      lot_size: null,
      parking_spaces: null,
      waterfront: false,
      description: "",
      status: "Active",
      list_price: "",
      days_on_market: 0,
      list_date: "",
      agent_name: "",
      agent_email: "",
      agent_phone: "",
      agent_id: "",

      // Media
      media: [],

      // Amenities
      amenities: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const handleReset = () => {
    setActiveStep(0);
    reset();
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    let isValid = false;

    switch (activeStep) {
      case 0: // General Info
        isValid = await methods.trigger([
          "property_type",
          "property_sub_type",
          "structure_type",
          "street_address",
          "city",
          "state",
          "postal_code",
        ]);
        break;
      case 1: // Property Details
        isValid = await methods.trigger([
          "bedrooms",
          "bathrooms",
          "year_built",
          "description",
          "status",
          "list_price",
          "agent_name",
          "agent_email",
          "agent_phone",
        ]);
        break;
      case 2: // Media
        isValid = await methods.trigger(["media"]);
        break;
      case 3: // Amenities
        isValid = true; // Amenities are optional
        break;
      case 4: // Summary - Submit the form
        methods.handleSubmit(onSubmit)();

        return;
      default:
        isValid = false;
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    toast.success("Property Added Successfully");

    // Here you would typically submit the data to your API
    setActiveStep(steps.length);
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs for the files
    const currentMedia = watch("media") || [];

    const newMedia = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      media_url: URL.createObjectURL(file),
      media_type: file.type.split("/")[1],
      is_primary: currentMedia.length === 0 && index === 0,
      display_order: currentMedia.length + index + 1,
    }));

    setValue("media", [...currentMedia, ...newMedia], { shouldValidate: true });
  };

  const renderStepContent = (activeStep) => {
    switch (activeStep) {
      case 0: // General Info
        return (
          <>
            <Grid item xs={12} sm={6}>
              <Controller
                name="property_type"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Property Type"
                    error={!!errors.property_type}
                    helperText={errors.property_type?.message}
                  >
                    {propertyTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="property_sub_type"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Property Sub Type"
                    error={!!errors.property_sub_type}
                    helperText={errors.property_sub_type?.message}
                  >
                    {propertySubTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="structure_type"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Structure Type"
                    error={!!errors.structure_type}
                    helperText={errors.structure_type?.message}
                  >
                    {structureTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="street_address"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Street Address"
                    placeholder="123 Main St"
                    error={!!errors.street_address}
                    helperText={errors.street_address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="City"
                    placeholder="Hollywood"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="State"
                    placeholder="FL"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="postal_code"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Postal Code"
                    placeholder="33021"
                    error={!!errors.postal_code}
                    helperText={errors.postal_code?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="is_featured"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label="Featured Property"
                  />
                )}
              />
            </Grid>
          </>
        );
      case 1: // Property Details
        return (
          <>
            <Grid item xs={12} sm={4}>
              <Controller
                name="bedrooms"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Bedrooms"
                    error={!!errors.bedrooms}
                    helperText={errors.bedrooms?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="bathrooms"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Bathrooms"
                    error={!!errors.bathrooms}
                    helperText={errors.bathrooms?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="year_built"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Year Built"
                    type="number"
                    error={!!errors.year_built}
                    helperText={errors.year_built?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="building_area"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Building Area (sq ft)"
                    type="number"
                    error={!!errors.building_area}
                    helperText={errors.building_area?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lot_size"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Lot Size (sq ft)"
                    type="number"
                    error={!!errors.lot_size}
                    helperText={errors.lot_size?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="parking_spaces"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Parking Spaces"
                    type="number"
                    error={!!errors.parking_spaces}
                    helperText={errors.parking_spaces?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="waterfront"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label="Waterfront Property"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Sold">Sold</MenuItem>
                    <MenuItem value="Leased">Leased</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="list_price"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="List Price"
                    type="number"
                    error={!!errors.list_price}
                    helperText={errors.list_price?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="agent_name"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Agent Name"
                    error={!!errors.agent_name}
                    helperText={errors.agent_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="agent_email"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Agent Email"
                    type="email"
                    error={!!errors.agent_email}
                    helperText={errors.agent_email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="agent_phone"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Agent Phone"
                    error={!!errors.agent_phone}
                    helperText={errors.agent_phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="agent_id"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Agent ID"
                    error={!!errors.agent_id}
                    helperText={errors.agent_id?.message}
                  />
                )}
              />
            </Grid>
          </>
        );
      case 2: // Media Details
        return (
          <>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Upload property images (first image will be set as primary)
              </Typography>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleMediaUpload}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Upload Images
                </Button>
              </label>
              {errors.media && (
                <FormHelperText error>{errors.media.message}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Uploaded Images ({watch("media")?.length || 0})
              </Typography>
              <Grid container spacing={2}>
                {watch("media")?.map((item, index) => (
                  <Grid item xs={6} sm={4} md={3} key={item.id}>
                    <Card>
                      <img
                        src={item.media_url}
                        alt={`Property image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <CardContent>
                        <Typography variant="caption">
                          {item.is_primary
                            ? "Primary Image"
                            : `Image ${index + 1}`}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            const updatedMedia = watch("media").filter(
                              (m) => m.id !== item.id,
                            );

                            setValue("media", updatedMedia, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          Remove
                        </Button>
                        {!item.is_primary && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                              const updatedMedia = watch("media").map((m) => ({
                                ...m,
                                is_primary: m.id === item.id,
                              }));

                              setValue("media", updatedMedia, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            Set as Primary
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </>
        );
      case 3: // Amenities
        return (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Community Amenities
              </Typography>
              <Grid container spacing={2}>
                {commonAmenities
                  .filter((amenity) => amenity.category === "Community")
                  .map((amenity) => (
                    <Grid item xs={6} sm={4} key={amenity.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={watch("amenities")?.includes(amenity.id)}
                            onChange={(e) => {
                              const currentAmenities = watch("amenities") || [];

                              if (e.target.checked) {
                                setValue(
                                  "amenities",
                                  [...currentAmenities, amenity.id],
                                  { shouldValidate: true },
                                );
                              } else {
                                setValue(
                                  "amenities",
                                  currentAmenities.filter(
                                    (id) => id !== amenity.id,
                                  ),
                                  { shouldValidate: true },
                                );
                              }
                            }}
                          />
                        }
                        label={amenity.name}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Property Amenities
              </Typography>
              <Grid container spacing={2}>
                {commonAmenities
                  .filter((amenity) => amenity.category === "Property")
                  .map((amenity) => (
                    <Grid item xs={6} sm={4} key={amenity.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={watch("amenities")?.includes(amenity.id)}
                            onChange={(e) => {
                              const currentAmenities = watch("amenities") || [];

                              if (e.target.checked) {
                                setValue(
                                  "amenities",
                                  [...currentAmenities, amenity.id],
                                  { shouldValidate: true },
                                );
                              } else {
                                setValue(
                                  "amenities",
                                  currentAmenities.filter(
                                    (id) => id !== amenity.id,
                                  ),
                                  { shouldValidate: true },
                                );
                              }
                            }}
                          />
                        }
                        label={amenity.name}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </>
        );
      case 4: // Summary
        return (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Property Summary
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        Property Type:
                      </Typography>
                      <Typography variant="body2">
                        {propertyTypes.find(
                          (type) => type.value === watch("property_type"),
                        )?.label || watch("property_type")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        Property Sub Type:
                      </Typography>
                      <Typography variant="body2">
                        {propertySubTypes.find(
                          (type) => type.value === watch("property_sub_type"),
                        )?.label || watch("property_sub_type")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Address:</Typography>
                      <Typography variant="body2">
                        {watch("street_address")}, {watch("city")},{" "}
                        {watch("state")} {watch("postal_code")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Bedrooms:</Typography>
                      <Typography variant="body2">
                        {watch("bedrooms")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Bathrooms:</Typography>
                      <Typography variant="body2">
                        {watch("bathrooms")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Year Built:</Typography>
                      <Typography variant="body2">
                        {watch("year_built")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Price:</Typography>
                      <Typography variant="body2">
                        ${watch("list_price")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Description:</Typography>
                      <Typography variant="body2">
                        {watch("description")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Images:</Typography>
                      <Typography variant="body2">
                        {watch("media")?.length || 0} images uploaded
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Amenities:</Typography>
                      <Typography variant="body2">
                        {watch("amenities")?.length > 0
                          ? commonAmenities
                              .filter((a) => watch("amenities").includes(a.id))
                              .map((a) => a.name)
                              .join(", ")
                          : "No amenities selected"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      <StepperWrapper>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => {
            return (
              <Step key={label.title}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className="step-label">
                    <div>
                      <Typography className="step-title">
                        {label.title}
                      </Typography>
                      <Typography className="step-subtitle">
                        {label.subtitle}
                      </Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </StepperWrapper>
      <Card className="mt-4">
        <CardContent>
          {activeStep === steps.length ? (
            <>
              <Typography className="mlb-2 mli-1">
                All steps are completed! Property has been added successfully.
              </Typography>
              <div className="flex justify-end mt-4">
                <Button variant="contained" onClick={handleReset}>
                  Add Another Property
                </Button>
              </div>
            </>
          ) : (
            <>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      <Typography className="font-medium" color="text.primary">
                        {steps[activeStep].title}
                      </Typography>
                      <Typography variant="body2">
                        {steps[activeStep].subtitle}
                      </Typography>
                    </Grid>
                    {renderStepContent(activeStep)}
                    <Grid item xs={12} className="flex justify-between">
                      <Button
                        variant="tonal"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        color="secondary"
                        startIcon={
                          <DirectionalIcon
                            ltrIconClass="tabler-arrow-left"
                            rtlIconClass="tabler-arrow-right"
                          />
                        }
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        endIcon={
                          activeStep === steps.length - 1 ? (
                            <i className="tabler-check" />
                          ) : (
                            <DirectionalIcon
                              ltrIconClass="tabler-arrow-right"
                              rtlIconClass="tabler-arrow-left"
                            />
                          )
                        }
                      >
                        {activeStep === steps.length - 1 ? "Submit" : "Next"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AddProperty;
