import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { Card, Divider, Row, Col, Typography, Button, Modal } from 'antd';
import axios from 'axios';
import apiUrl from '@/services/apiUrl';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

export default function Welcome() {
  const [viewDetails, setViewDetails] = useState(false);
  const { Meta } = Card;
  const columns = [
    {
      name: 'Record Id',
      options: {
        filter: true,
        display: 'excluded',
      },
    },
    {
      label: 'Patient Id',
      name: 'Patient Id',
      options: {
        filter: true,
        sortDirection: 'asc',
      },
    },
    {
      name: 'Description',
      options: {
        filter: false,
      },
    },
    {
      name: 'Prescription',
      options: {
        filter: true,
      },
    },
    {
      name: 'Location',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'View Details',
      options: {
        filter: true,
        sort: false,
        customBodyRender: () => (
          <Button type="primary" onClick={() => setViewDetails(true)}>
            View Details
          </Button>
        ),
      },
    },
  ];
  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'stacked',
  };
  const access_token = 'IRjsp7mWcTinLEixW0W8j7dRhZKyLCiHn0SqAdzVrAYFscjM5CRuCK5RN91lMmBA';

  const [docDetails, setDocDetails] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [queriedPatient, setqueriedPatient] = useState([]);
  const [patientId, setPatientId] = useState('string');
  const docId = 'pmcool97@gmail.com';
  useEffect(() => {
    axios({
      url: `${apiUrl}/api/DoctorProfile/${docId}`,
      method: 'get',
      headers: {
        Authorization: `${access_token}`,
      },
    }).then((response) => setDocDetails(response.data));
    axios({
      url: `${apiUrl}/api/Patient`,
      method: 'get',
      headers: {
        Authorization: `${access_token}`,
      },
    }).then((response) => setPatientsData(response.data));
    axios({
      url: `${apiUrl}/api/queries/selectMedicalRecordByDoctorAndPatientId?DoctorId=?doctorId=${docId}&doctorId=${docId}&patientId=${patientId}`,
      method: 'get',
      headers: {
        Authorization: `${access_token}`,
      },
    }).then((response) => setqueriedPatient(response.data));
  }, [axios]);
  const {
    ImageURL,
    firstName,
    lastName,
    EmailAddress,
    profileId,
    Dob,
    Qualifications,
    address,
  } = docDetails;
  const { Text } = Typography;
  const getMuiTheme = () =>
    createMuiTheme({
      palette: { type: 'dark' },
      overrides: {
        MUIDataTable: { root: { backgroundColor: '#141414' } },
      },
      typography: { useNextVariants: true },
    });
  return (
    <PageHeaderWrapper>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={16}>
          <Card>
            <Divider orientation="left" style={{ fontWeight: 'bold' }}>
              Patients Details
            </Divider>{' '}
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                options={options}
                data={patientsData.map((i) => {
                  return Object.values(i);
                })}
                columns={columns}
              />
            </MuiThemeProvider>
          </Card>
        </Col>
        <Col span={1} />
        <Card hoverable cover={<img alt="example" src={ImageURL} />}>
          <Meta title={`Dr.${firstName} ${lastName}`} description={`${EmailAddress}`} />
          <Divider orientation="left" style={{ fontWeight: 'bold' }}>
            Details
          </Divider>{' '}
          <div style={{ display: 'block' }}>
            <Text strong>DoctorId: </Text>
            <Text style={{ float: 'right' }}>{profileId}</Text>
            <br />
            <Text strong>DOB: </Text>
            <Text style={{ float: 'right' }}> {Dob}</Text>
            <br />
            <Text strong>Qualifications: </Text>
            <Text style={{ float: 'right' }}>{Qualifications}</Text>
            <br />
            <Text strong>Address: </Text>
            <Text style={{ float: 'right' }}>{profileId}</Text>
            <br />
            <Text strong>Country:</Text>{' '}
            <Text style={{ float: 'right' }}>{address && Object.values(address.country)}</Text>
            <br />
          </div>
        </Card>
      </Row>
      <Modal
        style={{ zIndex: 9999999 }}
        title="Patient Details"
        visible={viewDetails}
        onOk={() => setViewDetails(false)}
        onCancel={() => setViewDetails(false)}
        footer={[
          <Button key="back" onClick={() => setViewDetails(false)}>
            Okay
          </Button>,
        ]}
      >
        <Card>
          {queriedPatient.map((q) => (
            <div key={q.id}>
              <Meta
                title={q.patientId}
                description={`
              Description: ${q.description}
        `}
              />{' '}
              <div style={{ padding: 10 }} />
              <p>
                {' '}
                {`Prescription: ${q.prescription}
                Encounter Time: ${q.encounterTime}
                 Location: ${q.location}`}
              </p>
            </div>
          ))}
        </Card>
      </Modal>
    </PageHeaderWrapper>
  );
}
