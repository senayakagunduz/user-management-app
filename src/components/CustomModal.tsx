import { Field, Formik, Form as FormikForm } from "formik";
import { Button, Modal as BootstrapModal, Form } from "react-bootstrap";
import type { User } from "../types/user-types";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    selectedUser: User | null;
    onUserAdded?: () => void;
    onUserUpdated?: (user:User)=>void;
}

interface MyFormValues {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    university: string;
}

const CustomModal: React.FC<ModalProps> = ({
    show,
    onHide,
    selectedUser,
    onUserAdded,
    onUserUpdated
}) => {
    const initialValues: MyFormValues = selectedUser ? {
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        age: selectedUser.age || 0,
        gender: selectedUser.gender || '',
        email: selectedUser.email || '',
        phone: selectedUser.phone || '',
        university: selectedUser.university || ''
    } : {
        firstName: '',
        lastName: '',
        age: 0,
        gender: '',
        email: '',
        phone: '',
        university: ''
    };

    const handleSubmit = (values: MyFormValues, { setSubmitting }: any) => {
        const users = JSON.parse(localStorage.getItem('users') ?? '[]');

        if (selectedUser) {
            // Update existing user
            const updatedUser = { ...selectedUser, ...values };
            const updatedUsers = users.map((user: User) =>
                user.id === selectedUser.id ? updatedUser : user
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            onUserUpdated?.(updatedUser);
        } else {
            // Add new user
            const newUser: User = {
                ...values,
                id: Date.now(),
                maidenName: "",
                username: "",
                password: "",
                birthDate: "",
                image: "",
                bloodGroup: "",
                height: 0,
                weight: 0,
                eyeColor: "",
                hair: { color: "", type: "" },
                ip: "",
                address: {
                    address: "",
                    city: "",
                    coordinates: { lat: 0, lng: 0 },
                    postalCode: "",
                    state: "",
                    stateCode: "",
                    country: ""
                },
                macAddress: "",
                bank: {
                    cardExpire: "",
                    cardNumber: "",
                    cardType: "",
                    currency: "",
                    iban: ""
                },
                company: {
                    address: {
                        address: "",
                        city: "",
                        coordinates: { lat: 0, lng: 0 },
                        postalCode: "",
                        state: "",
                        stateCode: "",
                        country: ""
                    },
                    department: "",
                    name: "",
                    title: ""
                },
                ein: "",
                ssn: "",
                userAgent: "",
                crypto: {
                    coin: "",
                    wallet: "",
                    network: ""
                },
                role: ""
            };
            localStorage.setItem('users', JSON.stringify([...users, newUser]));
            onUserAdded?.();
        }

        setSubmitting(false);
        onHide();
    };

    return (
        <BootstrapModal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>
                    {selectedUser ? 'Edit User' : 'Add New User'}
                </BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <FormikForm className="p-3">
                            <Form.Group className="mb-3" controlId="formFirstname">
                                <Form.Label htmlFor="firstName">First Name</Form.Label>
                                <Field
                                    as={Form.Control}
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formLastname">
                                <Form.Label htmlFor="lastName">Last Name</Form.Label>
                                <Field
                                    as={Form.Control}
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formAge">
                                <Form.Label htmlFor="age">Age</Form.Label>
                                <Field
                                    as={Form.Control}
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="Enter your age"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formGender">
                                <Form.Label>Gender</Form.Label>
                                <div role="group" aria-labelledby="radio-group">
                                    <Form.Check
                                        as={Field}
                                        type="radio"
                                        id="male"
                                        name="gender"
                                        value="male"
                                        label="Male"
                                    />
                                    <Form.Check
                                        as={Field}
                                        type="radio"
                                        id="female"
                                        name="gender"
                                        value="female"
                                        label="Female"
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label htmlFor="email">Email Address</Form.Label>
                                <Field
                                    as={Form.Control}
                                    id="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    type="email"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPhone">
                                <Form.Label htmlFor="phone">Phone</Form.Label>
                                <Field
                                    as={Form.Control}
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    type="tel"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formUniversity">
                                <Form.Label htmlFor="university">University</Form.Label>
                                <Field
                                    as={Form.Control}
                                    id="university"
                                    name="university"
                                    placeholder="Enter your university"
                                    type="text"
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={onHide}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (selectedUser ? 'Update' : 'Save')}
                                </Button>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            </BootstrapModal.Body>
        </BootstrapModal>
    );
};

export default CustomModal;