import { useState } from "react";
import { EditBase, SimpleForm, Form, Title, SimpleFormIterator, SelectInput, Toolbar, SaveButton, ReferenceInput, ArrayInput, TextInput, TextField, NumberInput } from "react-admin";
import { Card, CardContent } from '@mui/material';

const GradesTableToolbar = props => (
    <Toolbar {...props} >
        <SaveButton />
    </Toolbar>
);

const FakeTextInput = props => {
    return (
      <TextInput {...props} InputProps={{ readOnly: true }} sx={{
        "& .MuiFilledInput-root": {
          backgroundColor: "transparent",
        },
      }} />
    );
}

const GradesTable = (props) => {
    return (<EditBase resource="lecturer_coursegrades" id={props["id"]} redirect={false}>
        <SimpleForm toolbar={<GradesTableToolbar />}>
            <ArrayInput source="student_grades">
                <SimpleFormIterator inline disableAdd disableRemove disableReordering fullWidth>
                    <FakeTextInput source="student_id" />
                    <FakeTextInput source="student_name" />
                    <NumberInput source="percentage" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </EditBase>);
}

export const AssignGradesPage = () => {
    const [courseId, setCourseId] = useState(null);

    return (
        <Card>
            <Title title="Assign Grades" />
            <CardContent>
                  <Form>
                    <ReferenceInput
                        source="course_id"
                        reference="lecturer_courses"
                    >
                        <SelectInput
                            optionText="name"
                            onChange={(e) => setCourseId(e.target.value)}
                        />
                    </ReferenceInput>
                  </Form>
                {courseId && <GradesTable id={courseId} />}
            </CardContent>
        </Card>
    );
}
