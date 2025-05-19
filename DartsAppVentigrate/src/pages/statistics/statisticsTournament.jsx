import { Group, Stack, Radio, Table, Button, Paper } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDatabase } from "../../context/databaseContext";
import { generateStatsList } from "../statistics/TournamentStats";
import { useTornooi } from "../tornooi/tornooiContext";
import { useNavigate } from "react-router";

function StatisticsTournament() {

    const [sort, setSort] = useState(null)
    const {users, throws, tournamentMatches} = useDatabase();
    const {players} = useTornooi();
    const [statsList, setStatsList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
            const newList = generateStatsList(throws, users, sort, players, tournamentMatches)
            setStatsList(newList)
       }, [throws, users, sort, players, tournamentMatches])

    return (
        <Stack align="center" spacing="md" h={'50rem'}>

            <Group position="center">
                <Paper bg={"#fff"} p={'md'}>
                    <Radio.Group
                        label="Selecteer om te filteren:"
                        value={sort}
                        onChange={setSort}
                    >
                        <Group>
                            <Radio value="name" label="Naam"/> 
                            <Radio value="Bull's eye" label="Bull's eye"/>
                            <Radio value="Triple 20" label="Triple 20"/> 
                            <Radio value="miss" label="Gemist"/> 
                        </Group>
                    </Radio.Group>
                </Paper>

            </Group>

            <div style={{w: 120}}>
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
                            {statsList.map((p,i) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{p.name}</Table.Td>
                                    <Table.Td>{p.bull}</Table.Td>
                                    <Table.Td>{p.triple}</Table.Td>
                                    <Table.Td>{p.miss}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>

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

export default StatisticsTournament;