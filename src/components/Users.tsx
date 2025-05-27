import { useEffect, useState } from "react";
import type { Root, User } from "../types/user-types";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { CiEdit, CiTrash } from "react-icons/ci";
import Pagination from "react-bootstrap/Pagination";
import CustomModal from "./CustomModal";


interface UsersProps {
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

function Users({ selectedUser, setSelectedUser }: UsersProps) {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiTotal, setApiTotal] = useState(0);
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const storedUsers = JSON.parse(localStorage.getItem('users') ?? '[]');
      setLocalUsers(storedUsers);

      const response = await axios.get<Root>('https://dummyjson.com/users', {
        params: {
          limit: usersPerPage,
          skip: 0
        }
      });
      setApiTotal(response.data.total);
      if (currentPage === Math.ceil((response.data.total + storedUsers.length) / usersPerPage)) {
      setUsers(storedUsers);
    } else {
      // Diğer sayfalarda API'den kullanıcıları çek
      const skip = (currentPage - 1) * usersPerPage;
      const apiResponse = await axios.get<Root>('https://dummyjson.com/users', {
        params: { limit: usersPerPage, skip }
      });
      setUsers(apiResponse.data.users);
    }
  } catch (error) {
    console.log(error);
    setLoading(false);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);


 const totalPages = Math.ceil((apiTotal + localUsers.length) / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }
  const goToFirstPage = () => setCurrentPage(1);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);


  const handleUserUpdated = (updatedUser: User) => {
    const storedUsers = JSON.parse(localStorage.getItem("users") ?? "[]");
    const updatedUsers = storedUsers.map((user: User) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    fetchUsers();
  };
  const handleUserAdded = () => {
    fetchUsers();
  };
  const handleDeleteUser = (id: number) => {
    const storedUsers = JSON.parse(localStorage.getItem("users") ?? "[]");
    const updatedUsers = storedUsers.filter((user: User) => user.id !== id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    fetchUsers();
  };

  const getPaginationItems = () => {
    const items = [];

    // Add First and Prev
    items.push(
      <Pagination.First key="first" onClick={goToFirstPage} disabled={currentPage === 1} />
    );
    items.push(
      <Pagination.Prev key="prev" onClick={goToPrevPage} disabled={currentPage === 1} />
    );

    // Logic to display page numbers with ellipsis
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all pages
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
    } else {
      // Complex pagination with ellipsis
      // Always show first page
      items.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          {1}
        </Pagination.Item>
      );

      // Add first ellipsis if needed
      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }

      // Determine the start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage < 4) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage > totalPages - 3) {
        startPage = totalPages - 3;
      }

      // Generate the middle section
      for (let number = startPage; number <= endPage; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      }

      // Add last ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }

      // Always show last page
      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Add Next and Last
    items.push(
      <Pagination.Next key="next" onClick={goToNextPage} disabled={currentPage === totalPages} />
    );
    items.push(
      <Pagination.Last key="last" onClick={goToLastPage} disabled={currentPage === totalPages} />
    );

    return items;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users</h2>
        <Button variant="primary" onClick={() => {
          setSelectedUser(null);
          setShow(true);
        }}>
          Add User
        </Button>
      </div>
      <CustomModal
        show={show}
        onHide={() => setShow(false)}
        selectedUser={selectedUser}
        onUserUpdated={handleUserUpdated}
        onUserAdded={handleUserAdded}
      />
      {loading ? <p>Loading...</p> : (
        <div className="d-flex flex-column align-items-center">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>University</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.age}</td>
                  <td>{user.gender}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.university}</td>
                  <td>
                    <CiEdit
                      className="text-success me-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setShow(true);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <CiTrash
                      className="text-danger"
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mx-auto">
            <Pagination>{getPaginationItems()}</Pagination>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
