import React, { useState, useEffect } from "react";

import { Card, Divider, Row, Col, Typography, Button, Modal } from "antd";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
var QRCode = require("qrcode.react");

export default function App() {
  const [viewDetails, setViewDetails] = useState(false);
  const { Meta } = Card;
  const columns = [
    {
      name: "Record Id",
      options: {
        filter: true,
        display: "excluded",
      },
    },
    {
      label: "Patient Id",
      name: "Patient Id",
      options: {
        filter: true,
        sortDirection: "asc",
      },
    },
    {
      name: "Doctor Id",
      options: {
        filter: false,
      },
    },
    {
      name: "Gender",
      options: {
        filter: true,
      },
    },
    {
      name: "Age",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "View Details",
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
    filterType: "dropdown",
    responsive: "stacked",
  };
  const access_token =
    "V3zRqS6NOrfl18M5D4BeZvrmPHutrSoOeUbV35BIVXm5LS2iMB2noEhAkE1EdWGb";

  const [docDetails, setDocDetails] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [queriedPatient, setqueriedPatient] = useState([]);
  const [patientId, setPatientId] = useState("joshi19981998@gmail.com");
  const docId = "pmcool97@gmail.com";
  useEffect(() => {
    axios({
      url: `http://segurodroga.ml:3000/api/DoctorProfile/${docId}`,
      method: "get",
      headers: {
        Authorization: `${access_token}`,
      },
    }).then((response) => setDocDetails(response.data));
    axios({
      url: `http://segurodroga.ml:3000/api/Patient`,
      method: "get",
      headers: {
        Authorization: `${access_token}`,
      },
    }).then((response) => setPatientsData(response.data));
    axios({
      url: `http://segurodroga.ml:3000/api/queries/selectMedicalRecordByDoctorAndPatientId?DoctorId=?doctorId=${docId}&doctorId=vrkarthik14@gmail.com&patientId=${patientId}`,
      method: "get",
      headers: {
        Authorization: `${access_token}`,
      },
    }).then((response) => setqueriedPatient(response.data));
  }, [patientId]);
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
      palette: { type: "dark" },
      overrides: {
        MUIDataTable: { root: { backgroundColor: "#141414" } },
      },
      typography: { useNextVariants: true },
    });
  return (
    <React.Fragment>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={16}>
          <Card>
            <Divider orientation="left" style={{ fontWeight: "bold" }}>
              Patients Details
            </Divider>{" "}
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
        <Card
          hoverable
          cover={<QRCode value="http://facebook.github.io/react/" />}
        >
          <Meta
            title={`Dr.${firstName} ${lastName}`}
            description={`${EmailAddress}`}
          />
          <Divider orientation="left" style={{ fontWeight: "bold" }}>
            Details
          </Divider>{" "}
          <div style={{ display: "block" }}>
            <Text strong>DoctorId: </Text>
            <Text style={{ float: "right" }}>{profileId}</Text>
            <br />
            <Text strong>DOB: </Text>
            <Text style={{ float: "right" }}> {Dob}</Text>
            <br />
            <Text strong>Qualifications: </Text>
            <Text style={{ float: "right" }}>{Qualifications}</Text>
            <br />
            <Text strong>Address: </Text>
            <Text style={{ float: "right" }}>{profileId}</Text>
            <br />
            <Text strong>Country:</Text>{" "}
            <Text style={{ float: "right" }}>
              {address && Object.values(address.country)}
            </Text>
            <br />
          </div>
        </Card>
      </Row>
      <pre>{JSON.stringify(queriedPatient, null, 4)}</pre>
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
              />{" "}
              <div style={{ padding: 10 }} />
              <p>
                {" "}
                {`Prescription: ${q.prescription}
                Encounter Time: ${q.encounterTime}
                 Location: ${q.location}`}
              </p>
            </div>
          ))}
        </Card>
      </Modal>
    </React.Fragment>
  );
}
