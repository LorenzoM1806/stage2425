using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DartsApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_TournamentMatches_TournamentMatchId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_TournamentParticipants_TournamentParticipantId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_TournamentParticipantId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Matches_TournamentMatchId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "TournamentParticipantId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TournamentMatchId",
                table: "Matches");

            migrationBuilder.AddColumn<int>(
                name: "PlayerId",
                table: "TournamentParticipants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MatchId",
                table: "TournamentMatches",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TournamentParticipants_PlayerId",
                table: "TournamentParticipants",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentMatches_MatchId",
                table: "TournamentMatches",
                column: "MatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_TournamentMatches_Matches_MatchId",
                table: "TournamentMatches",
                column: "MatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TournamentParticipants_Users_PlayerId",
                table: "TournamentParticipants",
                column: "PlayerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TournamentMatches_Matches_MatchId",
                table: "TournamentMatches");

            migrationBuilder.DropForeignKey(
                name: "FK_TournamentParticipants_Users_PlayerId",
                table: "TournamentParticipants");

            migrationBuilder.DropIndex(
                name: "IX_TournamentParticipants_PlayerId",
                table: "TournamentParticipants");

            migrationBuilder.DropIndex(
                name: "IX_TournamentMatches_MatchId",
                table: "TournamentMatches");

            migrationBuilder.DropColumn(
                name: "PlayerId",
                table: "TournamentParticipants");

            migrationBuilder.DropColumn(
                name: "MatchId",
                table: "TournamentMatches");

            migrationBuilder.AddColumn<int>(
                name: "TournamentParticipantId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TournamentMatchId",
                table: "Matches",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_TournamentParticipantId",
                table: "Users",
                column: "TournamentParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_TournamentMatchId",
                table: "Matches",
                column: "TournamentMatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_TournamentMatches_TournamentMatchId",
                table: "Matches",
                column: "TournamentMatchId",
                principalTable: "TournamentMatches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_TournamentParticipants_TournamentParticipantId",
                table: "Users",
                column: "TournamentParticipantId",
                principalTable: "TournamentParticipants",
                principalColumn: "Id");
        }
    }
}
