import { useMsal } from "@azure/msal-react";
import { Stack, Group, Button, Card, Divider, Grid, Text } from "@mantine/core";
import { DatePickerInput } from '@mantine/dates';
import { useState } from "react";
import { useDatabase } from "../../context/databaseContext";
import { getAmountOf180, getAmountOfBulls, getAmountOfBullsEye, getAmountOfTriple20, getScoreLowerThen100, getScoresAbove100, getScoresAbove140 } from "./ProfileStats";
import { useNavigate } from "react-router";

function StatisticsProfile() {

    const {instance} = useMsal()
    const { users, throws } = useDatabase()
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const players = instance.getAllAccounts()
    const user = users.find((u) => u.email === players[0].username)
    const navigate = useNavigate()


    return (
        <Stack align="center" spacing="md">

            <Group position="center">
        
                <DatePickerInput
                    clearable
                    valueFormat="YYYY MMM DD"
                    label="Kies de startdatum"
                    placeholder="Kies de startdatum"
                    value={date1}
                    onChange={setDate1}
                />

                <DatePickerInput
                    clearable
                    valueFormat="YYYY MMM DD"
                    label="Kies de einddatum"
                    placeholder="Kies de einddatum"
                    value={date2}
                    onChange={setDate2}
                />           
        
            </Group>

            <Card shadow="sm" radius="md" padding="lg" withBorder>
                    <Text size="lg" weight={500} align="center">
                        Statistieken
                    </Text>
                    <Divider my="sm" />
                    <Grid gutter="xs">
                        {/*Amount of Bulls eye */}
                        <Grid.Col span={4} key={1}>
                        <Text size="sm" align="center">Bull's eyes</Text>
                        <Text size="xl" align="center">{getAmountOfBullsEye(user.id, throws, date1, date2)}</Text>
                        </Grid.Col>

                        {/*Amount of Bull */}
                        <Grid.Col span={4} key={2}>
                        <Text size="sm" align="center">Bull's</Text>
                        <Text size="xl" align="center">{getAmountOfBulls(user.id, throws, date1, date2)}</Text>
                        </Grid.Col>

                        {/*Amount of triple 20 */}
                        <Grid.Col span={4} key={3}>
                        <Text size="sm" align="center">Triple 20's</Text>
                        <Text size="xl" align="center">{getAmountOfTriple20(user.id, throws, date1, date2)}</Text>
                        </Grid.Col>

                        {/*Amount of 180s */}
                        <Grid.Col span={4} key={4}>
                        <Text size="sm" align="center">180's</Text>
                        <Text size="xl" align="center">{getAmountOf180(user.id, throws, date1, date2)}</Text>
                        </Grid.Col>

                        {/*scores >= 140 */}
                        <Grid.Col span={4} key={5}>
                        <Text size="sm" align="center">Scores 140+ </Text>
                        <Text size="xl" align="center">{getScoresAbove140(user.id, throws, date1, date2)}</Text>
                        </Grid.Col>

                        {/*scores >= 100 */}
                        <Grid.Col span={4} key={6}>
                        <Text size="sm" align="center">Scores 100+ </Text>
                        <Text size="xl" align="center">{getScoresAbove100(user.id, throws, date1, date2)}</Text>
                        </Grid.Col>

                        {/*scores < 100 */}
                        <Grid.Col span={4} key={7}>
                        <Text size="sm" align="center">Lager dan 100</Text>
                        <Text size="xl" align="center">{getScoreLowerThen100(user.id, throws, date1, date2)}</Text>
                        </Grid.Col>

                    </Grid>
                </Card>    
        
                <Button
                    variant="outline"
                    color="dark"
                    bg="#fff"
                    size="lg"
                    w={290}
                    style={{
                    boxShadow: "2px 3px black",
                    borderRadius: "8px"
                    }}
                    onClick={() => navigate(-1)}>
                    Profiel
                </Button>    

        </Stack>
    )
}

export default StatisticsProfile;