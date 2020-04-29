import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { Card, Divider, Row, Col, Typography } from 'antd';
import axios from 'axios';
import apiUrl from '@/services/apiUrl';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const { Meta } = Card;
const columns = ['Record Id', 'Patient Id', 'Description', 'Prescription', 'Location'];
const access_token = 'leQNs5QGw7JbtdDKGTcAyrGeoqX3AykRHmBYqWpxk8GajiLpMS1yYqLVsbisCEnG';
export default function Welcome() {
  const [docDetails, setDocDetails] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
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
      {/* <pre>{JSON.stringify(patientsData, null, 4)}</pre>
      <pre>
        {JSON.stringify(
          patientsData.map((i) => {
            return Object.values(
              i.authorized.map((j) => {
                if (j === 'test@test.com') return j;

              }),
            );
          }),
        )}
      </pre> */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={16}>
          <Card>
            <Divider orientation="left" style={{ fontWeight: 'bold' }}>
              Patients Details
            </Divider>{' '}
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
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
    </PageHeaderWrapper>
  );
}
