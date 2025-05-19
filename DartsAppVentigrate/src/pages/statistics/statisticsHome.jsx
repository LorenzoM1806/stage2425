import { Group, Stack, MultiSelect, Table, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import {DatePickerInput} from "@mantine/dates"
import { useDatabase } from "../../context/databaseContext";
import { generateStatsList } from "./HomeStats";
import { useNavigate } from "react-router";

function StatisticsHome() {
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [players, setPlayers] = useState([])
    const {users, throws} = useDatabase();
    const [statsList, setStatsList] = useState([]);
    const navigate = useNavigate()

    const allUsers = () => {
        return users.map((u) => ({ value: u.name, label: u.name }))
    }

   useEffect(() => {
        const newList = generateStatsList(throws, players,users,date1, date2)
        setStatsList(newList)
   }, [throws, users,players, date1, date2])

    return (
        <Stack align="center" spacing="md" p={20} h={'50rem'}>

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
                    label="Kies de einddatum"
                    placeholder="Kies de einddatum"
                    value={date2}
                    onChange={setDate2}
                    />
            </Group>

            <MultiSelect
                    label="Welke spelers wenst u te zien?"
                    placeholder='Kies spelers'
                    data={allUsers()}
                    searchable
                    onChange={setPlayers}
                    w={200}
                />

                <Table.ScrollContainer w={350}>
                    <Table highlightOnHover withTableBorder bg="white">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Speler</Table.Th>
                                <Table.Th>Bull's eyes</Table.Th>
                                <Table.Th>Triple 20's</Table.Th>
                                <Table.Th>Gemist</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                        {statsList.map((p, i) => (
                            <Table.Tr key={i}>
                                {/* now rendering your real data */}
                                <Table.Td>{p.name}</Table.Td>
                                <Table.Td>{p.bull}</Table.Td>
                                <Table.Td>{p.triple}</Table.Td>
                                <Table.Td>{p.miss}</Table.Td>
                            </Table.Tr>
                        ))}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>

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
                    onClick={() => navigate("/home")}
                > Home
                </Button>

        </Stack>
    )
}

export default StatisticsHome;