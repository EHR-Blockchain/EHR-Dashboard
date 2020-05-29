import { MuiThemeProvider } from "@material-ui/core";
import { Button, Card, Col, Divider, Layout, Row, Typography } from "antd";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";

const { Header, Footer, Content } = Layout;

var QRCode = require("qrcode.react");

export default function App() {
  var getParams = function (url) {
    var params = {};
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };
  const params = getParams(window.location.href);

  const email = params.email;
  const access_token = params.access_token;
  const [viewDetails, setViewDetails] = useState(false);
  const { Meta } = Card;
  const columns = [
    {
      name: "patientId",
      label: "Patient Id",
    },
    {
      label: "Age",
      name: "age",
    },
    {
      name: "gender",
      label: "Gender",
    },

    {
      label: <></>,
      name: "patientId",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => (
          <Button
            type="primary"
            onClick={() => {
              setViewDetails(true);
              console.log("VALUESSSSSSS", value);
              setPatientId(value);
            }}
          >
            View Details
          </Button>
        ),
      },
    },
  ];
  const options = {
    selectableRows: false,

    filter: false,
    print: false,
    search: false,
    download: false,
    viewColumns: false,
    filterType: "dropdown",

    responsive: "stacked",
  };

  const [docDetails, setDocDetails] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [queriedPatient, setqueriedPatient] = useState([]);
  const [patientId, setPatientId] = useState("");
  const docId = email;
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
      url: `http://segurodroga.ml:3000/api/queries/selectMedicalRecordByDoctorAndPatientId?DoctorId=?doctorId=${docId}&doctorId=${email}&patientId=${patientId}`,
      method: "get",
      headers: {
        Authorization: `${access_token}`,
      },
    }).then((response) => setqueriedPatient(response.data));
  }, [access_token, docId, email, patientId]);
  const {
    firstName,
    lastName,
    profileId,
    Dob,
    Qualifications,
    address,
  } = docDetails;
  const { Text } = Typography;

  return (
    <React.Fragment>
      {" "}
      {viewDetails ? (
        <ViewDetails queriedPatient={queriedPatient} />
      ) : (
        <Layout>
          <Header style={{ color: "#fff" }}>EHR Dashboard</Header>

          <Content style={{ padding: "5%" }}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={16}>
                <Card>
                  <Divider orientation="left" style={{ fontWeight: "bold" }}>
                    Patients Details
                  </Divider>{" "}
                  <MuiThemeProvider>
                    <MUIDataTable
                      options={options}
                      data={patientsData}
                      columns={columns}
                    />
                  </MuiThemeProvider>
                </Card>
              </Col>
              <Col span={1} />
              <Card
                hoverable
                cover={
                  <QRCode
                    value={email}
                    style={{ width: "100%", height: "auto" }}
                  />
                }
              >
                <Meta
                  title={`Dr.${firstName} ${lastName}`}
                  description={`${email}`}
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
            {/* <Modal
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
          </Modal> */}
            <Footer style={{ textAlign: "center" }}>EHR Dashboard</Footer>
          </Content>
        </Layout>
      )}
    </React.Fragment>
  );
}

const ViewDetails = (props) => {
  return (
    <div>
      {" "}
      <React.Fragment>
        <Header style={{ color: "#fff" }}>Patient Details</Header>

        <Layout>
          {" "}
          <pre>{JSON.stringify(props.queriedPatient, null, 4)}</pre>
        </Layout>
      </React.Fragment>
    </div>
  );
};
