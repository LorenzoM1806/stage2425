﻿// <auto-generated />
using System;
using DartsApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DartsApi.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250415131039_DtoForThrow")]
    partial class DtoForThrow
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("DartsApi.Models.Checkout", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CheckoutPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Score")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Checkouts");
                });

            modelBuilder.Entity("DartsApi.Models.Gamemode", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Gamemodes");
                });

            modelBuilder.Entity("DartsApi.Models.Match", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<int>("GamemodeId")
                        .HasColumnType("int");

                    b.Property<int>("Player1Id")
                        .HasColumnType("int");

                    b.Property<int>("Player2Id")
                        .HasColumnType("int");

                    b.Property<int?>("WinnerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("GamemodeId");

                    b.HasIndex("Player1Id");

                    b.HasIndex("Player2Id");

                    b.HasIndex("WinnerId");

                    b.ToTable("Matches");
                });

            modelBuilder.Entity("DartsApi.Models.Throw", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("MatchId")
                        .HasColumnType("int");

                    b.Property<int>("SpelerId")
                        .HasColumnType("int");

                    b.Property<int>("Throw1")
                        .HasColumnType("int");

                    b.Property<int>("Throw2")
                        .HasColumnType("int");

                    b.Property<int>("Throw3")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MatchId");

                    b.HasIndex("SpelerId");

                    b.ToTable("Throws");
                });

            modelBuilder.Entity("DartsApi.Models.Tournament", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<int?>("WinnerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("WinnerId");

                    b.ToTable("Tournaments");
                });

            modelBuilder.Entity("DartsApi.Models.TournamentMatch", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("MatchId")
                        .HasColumnType("int");

                    b.Property<string>("Round")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TournamentId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MatchId");

                    b.HasIndex("TournamentId");

                    b.ToTable("TournamentMatches");
                });

            modelBuilder.Entity("DartsApi.Models.TournamentParticipant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("PlayerId")
                        .HasColumnType("int");

                    b.Property<int>("TournamentId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.HasIndex("TournamentId");

                    b.ToTable("TournamentParticipants");
                });

            modelBuilder.Entity("DartsApi.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("FavoriteGameId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("FavoriteGameId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DartsApi.Models.Match", b =>
                {
                    b.HasOne("DartsApi.Models.Gamemode", "Gamemode")
                        .WithMany()
                        .HasForeignKey("GamemodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DartsApi.Models.User", "Player1")
                        .WithMany()
                        .HasForeignKey("Player1Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DartsApi.Models.User", "Player2")
                        .WithMany()
                        .HasForeignKey("Player2Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DartsApi.Models.User", "Winner")
                        .WithMany()
                        .HasForeignKey("WinnerId");

                    b.Navigation("Gamemode");

                    b.Navigation("Player1");

                    b.Navigation("Player2");

                    b.Navigation("Winner");
                });

            modelBuilder.Entity("DartsApi.Models.Throw", b =>
                {
                    b.HasOne("DartsApi.Models.Match", "Match")
                        .WithMany()
                        .HasForeignKey("MatchId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DartsApi.Models.User", "Speler")
                        .WithMany()
                        .HasForeignKey("SpelerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Match");

                    b.Navigation("Speler");
                });

            modelBuilder.Entity("DartsApi.Models.Tournament", b =>
                {
                    b.HasOne("DartsApi.Models.User", "Winner")
                        .WithMany()
                        .HasForeignKey("WinnerId");

                    b.Navigation("Winner");
                });

            modelBuilder.Entity("DartsApi.Models.TournamentMatch", b =>
                {
                    b.HasOne("DartsApi.Models.Match", "Match")
                        .WithMany()
                        .HasForeignKey("MatchId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DartsApi.Models.Tournament", "Tournament")
                        .WithMany()
                        .HasForeignKey("TournamentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Match");

                    b.Navigation("Tournament");
                });

            modelBuilder.Entity("DartsApi.Models.TournamentParticipant", b =>
                {
                    b.HasOne("DartsApi.Models.User", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DartsApi.Models.Tournament", "Tournament")
                        .WithMany()
                        .HasForeignKey("TournamentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Player");

                    b.Navigation("Tournament");
                });

            modelBuilder.Entity("DartsApi.Models.User", b =>
                {
                    b.HasOne("DartsApi.Models.Gamemode", "FavoriteGame")
                        .WithMany()
                        .HasForeignKey("FavoriteGameId");

                    b.Navigation("FavoriteGame");
                });
#pragma warning restore 612, 618
        }
    }
}
