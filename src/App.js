import { MuiThemeProvider } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import TimerIcon from "@material-ui/icons/Timer";
import moment from "moment";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import SchoolIcon from "@material-ui/icons/School";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";
import LanguageIcon from "@material-ui/icons/Language";
import EmailIcon from "@material-ui/icons/Email";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Typography,
} from "antd";
import axios from "axios";
import DescriptionIcon from "@material-ui/icons/Description";
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
        customBodyRender: (value) => (
          <Button
            type="primary"
            onClick={() => {
              setViewDetails(true);
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
        <ViewDetails
          queriedPatient={queriedPatient}
          patientId={patientId}
          access_token={access_token}
        />
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
                style={{ width: 300, padding: "10px", margin: "30px" }}
                cover={
                  <QRCode
                    value={email}
                    style={{ width: "100%", height: "auto" }}
                  />
                }
              >
                <Meta
                  title={
                    <center>
                      <Typography type="subheading">
                        {" "}
                        Dr.{firstName} {lastName}
                      </Typography>
                    </center>
                  }
                  description={
                    <span style={{ display: "block" }}>
                      <EmailIcon />
                      <Typography style={{ float: "right" }}>
                        {email}
                      </Typography>
                    </span>
                  }
                />
                <Divider orientation="left" style={{ fontWeight: "bold" }}>
                  Details
                </Divider>{" "}
                <div style={{ display: "block" }}>
                  <LocalHospitalIcon />
                  <Text style={{ float: "right" }}>{profileId}</Text>
                  <br />
                  <AccountCircleIcon />{" "}
                  <Text style={{ float: "right" }}> {Dob}</Text>
                  <br />
                  <SchoolIcon />{" "}
                  <Text style={{ float: "right" }}>{Qualifications}</Text>
                  <br />
                  <HomeIcon />{" "}
                  <Text style={{ float: "right" }}>{profileId}</Text>
                  <br />
                  <LanguageIcon />{" "}
                  <Text style={{ float: "right" }}>
                    {address && Object.values(address.country)}
                  </Text>
                  <br />
                </div>
              </Card>
            </Row>

            <Footer style={{ textAlign: "center" }}>EHR Dashboard</Footer>
          </Content>
        </Layout>
      )}
    </React.Fragment>
  );
}

const ViewDetails = (props) => {
  const { Meta } = Card;
  const [goBack, setGoBack] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [newPatientData, setNewPatientData] = useState([]);
  const onClickCloseModal = () => setFormOpen(false);
  const [records, setRecords] = useState(0);
  useEffect(() => {
    axios({
      url: `http://segurodroga.ml:3000/api/MedicalRecord`,
      method: "get",
      headers: {
        Authorization: `${props.access_token}`,
      },
    }).then((response) => {
      setNewPatientData(response.data);
      setRecords(newPatientData.length);
    });
  }, [newPatientData.length, props.access_token, setNewPatientData]);
  if (goBack) {
    return <App />;
  }
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const [form] = Form.useForm();
  console.log(props.queriedPatient[0]);
  const onFinish = ({ location, description, prescription }) => {
    axios({
      url: `http://segurodroga.ml:3000/api/MedicalRecord`,
      method: "post",
      headers: {
        Authorization: `${props.access_token}`,
      },
      data: {
        $class: "org.med.chain.MedicalRecord",
        recordId: 1 + records,
        patientId: props.patientId,
        doctorId: "pmcool97gmail.com",
        version: 0,
        authorized: [],
        description: description,
        prescription: prescription,
        encounterTime: moment(),
        location: location,
      },
    }).then((response) => alert("Submitted"));
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      {" "}
      <React.Fragment>
        <Header
          style={{ color: "#fff", cursor: "pointer" }}
          onClick={() => setGoBack(true)}
        >
          Patient Details
        </Header>

        <Layout>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {props.queriedPatient.map((q) => (
              <Card
                key={q.id}
                hoverable
                style={{ width: 300, padding: "10px", margin: "30px" }}
                cover={
                  <img
                    alt="example"
                    src={`https://api.adorable.io/avatars/171/${q.patientId}`}
                  />
                }
              >
                <Meta
                  title={
                    <Typography style={{ color: "#A5AAC5" }}>
                      {q.patientId}
                    </Typography>
                  }
                  description={
                    <span>
                      <DescriptionIcon />{" "}
                      <Typography>{q.description}</Typography>
                    </span>
                  }
                />{" "}
                <div style={{ padding: 10 }} />
                <div style={{ display: "flex", padding: "20" }}>
                  <LocalHospitalIcon />{" "}
                  <Typography>{q.prescription}</Typography>
                  <div style={{ padding: 10 }} />
                  <TimerIcon />{" "}
                  <Typography type="info" style={{ fontSize: "10px" }}>
                    {moment(q.encounterTime).format("YYYY-MM-DD")}
                  </Typography>
                  <div style={{ padding: 10 }} />
                  <LocationCityIcon /> <Typography>{q.location}</Typography>
                  <div style={{ padding: 10 }} />
                </div>
              </Card>
            ))}
            {newPatientData.map((q) => (
              <Card
                key={q.id}
                hoverable
                style={{ width: 300, padding: "10px", margin: "30px" }}
                cover={
                  <img
                    alt="example"
                    src={`https://api.adorable.io/avatars/171/${q.patientId}`}
                  />
                }
              >
                <Meta
                  title={
                    <Typography style={{ color: "#A5AAC5" }}>
                      {q.patientId}
                    </Typography>
                  }
                  description={
                    <span>
                      <DescriptionIcon />{" "}
                      <Typography>{q.description}</Typography>
                    </span>
                  }
                />{" "}
                <div style={{ padding: 10 }} />
                <div style={{ display: "flex", padding: "20" }}>
                  <LocalHospitalIcon />{" "}
                  <Typography>{q.prescription}</Typography>
                  <div style={{ padding: 10 }} />
                  <TimerIcon />{" "}
                  <Typography type="info" style={{ fontSize: "10px" }}>
                    {moment(q.encounterTime).format("YYYY-MM-DD")}
                  </Typography>
                  <div style={{ padding: 10 }} />
                  <LocationCityIcon /> <Typography>{q.location}</Typography>
                  <div style={{ padding: 10 }} />
                </div>
              </Card>
            ))}
          </Row>

          <Fab
            color="primary"
            aria-label="add"
            style={{
              top: "auto",

              float: "right",
              margin: "0px",
              right: "20px",
              left: "auto",
              position: "fixed",
            }}
            onClick={() => setFormOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Layout>
        <Modal
          style={{ zIndex: 9999999 }}
          title="Patient Details"
          visible={formOpen}
          onOk={() => onClickCloseModal()}
          onCancel={() => onClickCloseModal()}
          footer={[<></>]}
        >
          <Card>
            <Form
              {...layout}
              form={form}
              name="control-hooks"
              onFinish={onFinish}
            >
              <Form.Item
                name="prescription"
                label="Prescription"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      </React.Fragment>
    </div>
  );
};
