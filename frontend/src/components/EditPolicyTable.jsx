import React, { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

function PolicyTable() {
    const actions = [
        'View Users',
        'Add Users',
        'Edit User Details',
        'Delete Users',
        'Update Points',
        'View Account Points',
        'Read Logging Information'

        // Add more actions as needed
      ];
    
      const roles = ['owner', 'manager', 'engineer', 'Product Manager'];
    
      const [selectedRoles, setSelectedRoles] = useState(
        actions.reduce((acc, action) => {
          acc[action] = {};
          roles.forEach(role => {
            acc[action][role] = false;
          });
          return acc;
        }, {})
      );
    
      const handleCheckboxChange = (action, role) => {
        setSelectedRoles(prevRoles => ({
          ...prevRoles,
          [action]: {
            ...prevRoles[action],
            [role]: !prevRoles[action][role]
          }
        }));
      };

    const colStyle = {
        outline: '1px solid black', 
        backgroundColor: '#1C2434',
        color:'white'
    };
    
    const selectStyle = {
        textAlign: 'center'
    };

    const actionStyle = {
        textAlign: 'center',
        outline: '1px solid black'
    };
    
    const rowStyle={
        outline: '1px solid black'
    }
    
    const tableStyle={
        width: '100%'
    }
    
    
  return (
    <Container className='mt-10'>
        {/* <Row>
            <Col style={outlineStyle}>Policy</Col>
            <Col style={outlineStyle} >Role</Col>
        </Row> */}
        <Table size="lg" style={tableStyle} className="p-5">
            <thead>
                <tr>
                    <th rowSpan={2} style={{...colStyle, padding: '10px'}}>Policies</th>
                    <th colSpan={4} style={{...colStyle, padding: '10px'}}>Roles</th>     
                </tr>
                <tr>
                {roles.map(role => (
                    <th key={role} style={{ ...colStyle, padding: '20px' }}>{role.charAt(0).toUpperCase() + role.slice(1)}</th>
                ))}     
                </tr>
            </thead>
            <tbody>
                {actions.map(action => (
                    <tr key={action} style={rowStyle}>
                        <td style={{ ...actionStyle, padding: '20px' }}>{action}</td>
                        {roles.map(role => (
                        <td key={role} style={{ ...selectStyle, padding: '20px' }}>
                            <input
                            type="checkbox"
                            checked={selectedRoles[action][role]}
                            onChange={() => handleCheckboxChange(action, role)}
                            />
                        </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
        
    </Container>
  );
}

export default PolicyTable;